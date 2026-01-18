# Authentication Code Review
**Date:** January 16, 2026
**Stage 2.4:** Pre-emptive Issue Identification

---

## Code Flow Analysis

### 1. Wallet Connection Flow
```
User clicks "CONNECT WALLET"
→ ConnectButton.tsx calls connect({ connector: connectors[0] })
→ Wagmi handles MetaMask connection
→ useAccount() hook updates with address and isConnected
→ UI shows connected state (truncated address)
```

**Status:** ✅ LOOKS GOOD
- Uses wagmi's standard connection flow
- Fallback to first connector (injected wallet)
- Clean UI state management

**Potential Issue:**
- ⚠️ `connectors[0]` might not exist if no wallet installed
- ⚠️ No error handling for connection failures

---

### 2. Authentication Flow
```
User clicks "AUTHENTICATE →"
→ usePear.authenticate() called
→ authenticateWithPear(address, signTypedDataAsync)
  → Step 1: GET /auth/eip712-message
  → Step 2: Sign with wallet (signTypedDataAsync)
  → Step 3: POST /auth/login with signature
→ Save tokens (saveAuthTokens)
→ Check agent wallet (getAgentWallet)
→ If not exists, create (createAgentWallet)
→ Update UI state
```

**Status:** ✅ MOSTLY GOOD

**Issues Found:**

#### Issue 1: No Error Messages to User
**Location:** `src/hooks/usePear.ts` lines 68-72

```typescript
} catch (err) {
  setError(err as Error);
  setIsAuthenticating(false);
  throw err; // ← Thrown but not caught anywhere
}
```

**Problem:** Error is thrown but UI doesn't show it to user
**Impact:** User sees button return to normal with no explanation

**Fix:** Add toast notifications or error display

---

#### Issue 2: isAuthenticated Might Fail on SSR
**Location:** `src/hooks/usePear.ts` line 84

```typescript
isAuthenticated: (typeof window !== 'undefined' && isAuthenticated() && isConnected) || false,
```

**Problem:** Complex conditional that checks both localStorage and wagmi state
**Impact:** Might cause hydration mismatch between server/client

**Fix:** Simplify or ensure client-only evaluation

---

#### Issue 3: Agent Wallet Not Persisted
**Location:** `src/hooks/usePear.ts` lines 35-44

```typescript
async function loadAgentWallet(token: string) {
  try {
    const wallet = await getAgentWallet(token);
    if (wallet.exists) {
      setAgentWallet(wallet.address);
      // ← No localStorage.setItem for agent wallet
    }
  } catch (err) {
    console.error('Failed to load agent wallet:', err);
  }
}
```

**Problem:** Agent wallet address not saved to localStorage
**Impact:** Need to fetch it on every page load (extra API call)

**Fix:** Save to localStorage like tokens

---

#### Issue 4: Concurrent Auth Attempts Not Prevented
**Location:** `src/hooks/usePear.ts` lines 46-73

```typescript
async function authenticate() {
  if (!address || !isConnected) {
    throw new Error('Wallet not connected');
  }

  setIsAuthenticating(true);
  // ← No check if already authenticating
```

**Problem:** User can click authenticate multiple times rapidly
**Impact:** Multiple parallel requests, wasted API calls, potential race conditions

**Fix:** Check `isAuthenticating` before proceeding

---

#### Issue 5: Disconnect Doesn't Clear Pear State
**Location:** `src/hooks/usePear.ts` lines 75-79

```typescript
function disconnect() {
  setAccessToken(null);
  setAgentWallet(null);
  clearAuthTokens();
  // ← Doesn't disconnect wagmi wallet
}
```

**Problem:** Clears Pear auth but wallet stays connected
**Impact:** Confusing UX - user thinks they disconnected but wallet still shows

**Fix:** Either rename function or also call wagmi's disconnect

---

#### Issue 6: No Retry for Failed Requests
**Location:** `src/integrations/pear/auth.ts` lines 9-15

```typescript
const messageResponse = await fetch(
  `${PEAR_CONFIG.apiUrl}/auth/eip712-message?address=${userAddress}&clientId=${PEAR_CONFIG.clientId}`
);

if (!messageResponse.ok) {
  throw new Error('Failed to get EIP712 message');
  // ← No retry logic
}
```

**Problem:** Network failures cause immediate failure
**Impact:** User has to manually retry

**Fix:** Add retry with exponential backoff (for transient failures)

---

#### Issue 7: Signature Rejection Not Handled Gracefully
**Location:** `src/integrations/pear/auth.ts` lines 19-25

```typescript
const signature = await signTypedData({
  domain: eip712Data.domain,
  types: eip712Data.types,
  primaryType: eip712Data.primaryType,
  message: eip712Data.message,
});
// If user rejects, this throws
```

**Problem:** User rejection throws generic error
**Impact:** Error message is not user-friendly

**Fix:** Catch user rejection specifically and show helpful message

---

### 3. Agent Wallet Creation Flow

**Status:** ✅ LOOKS GOOD

**Code:** `src/integrations/pear/agent.ts`

Handles:
- GET to check if exists (404 = doesn't exist)
- POST to create if needed
- Proper error handling

**Minor Issue:**
- Response field could be `address` OR `walletAddress` (line 28, 50)
- Unclear which one Pear API actually returns

**Fix:** Test with real API, adjust if needed

---

### 4. Token Management

**Status:** ⚠️ NEEDS IMPROVEMENT

#### Issue 8: Token Refresh Not Implemented in usePear
**Location:** `src/integrations/pear/auth.ts` lines 97-120

```typescript
export async function refreshAccessToken(): Promise<string> {
  // ... implementation exists ...
}
```

But `usePear.ts` never calls this function!

**Problem:** When token expires (15 min), user must re-authenticate
**Impact:** Poor UX - user is logged out mid-session

**Fix:** Implement automatic token refresh before expiry

---

#### Issue 9: Token Expiry Calculation Hardcoded
**Location:** `src/integrations/pear/auth.ts` line 62

```typescript
localStorage.setItem('pear_token_expiry', String(Date.now() + 900000)); // 15 min
```

**Problem:** Hardcoded 900000 (15 min), but API returns `expiresIn`
**Impact:** If API changes expiry time, our calculation is wrong

**Fix:** Use `expiresIn` from API response

---

#### Issue 10: No Token Expiry Check Before API Calls
**Location:** `src/integrations/pear/positions.ts`, `agent.ts`

```typescript
export async function executePosition(
  accessToken: string,
  params: ExecutePositionParams
): Promise<{ orderId: string }> {
  // ← No check if token is still valid
  const response = await fetch(`${PEAR_CONFIG.apiUrl}/positions`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
```

**Problem:** Might send expired token, get 401, no auto-refresh
**Impact:** User sees error instead of transparent refresh

**Fix:** Check expiry before request, refresh if needed

---

## Recommended Fixes Priority

### HIGH PRIORITY (Fix before Stage 2 testing)

1. **Fix #4:** Prevent concurrent auth attempts
   ```typescript
   if (isAuthenticating) return; // Add at start of authenticate()
   ```

2. **Fix #1:** Add error notifications
   ```typescript
   import toast from 'react-hot-toast';
   // In catch block:
   toast.error(err.message || 'Authentication failed');
   ```

3. **Fix #9:** Use actual expiresIn from API
   ```typescript
   const expiry = Date.now() + data.expiresIn;
   localStorage.setItem('pear_token_expiry', String(expiry));
   ```

### MEDIUM PRIORITY (Fix after basic testing works)

4. **Fix #8:** Implement token refresh logic
5. **Fix #3:** Persist agent wallet to localStorage
6. **Fix #7:** Better handling of signature rejection

### LOW PRIORITY (Nice to have)

7. **Fix #6:** Retry logic for network failures
8. **Fix #10:** Proactive token expiry checks

---

## Testing Checklist

After applying fixes, verify:

- [ ] Cannot double-click authenticate
- [ ] Error messages appear on failures
- [ ] Token expiry is calculated correctly
- [ ] Rejected signature shows helpful error
- [ ] Agent wallet persists across refresh

---

## Code Quality Assessment

**Overall:** 🟡 GOOD but needs refinements

**Strengths:**
- Clean separation of concerns (hooks, integrations, components)
- Proper TypeScript typing
- EIP-712 implementation matches spec
- Local storage abstraction

**Weaknesses:**
- Missing error UX (no toast/modal for errors)
- Token refresh not implemented
- Some edge cases not handled

**Recommendation:** Apply HIGH priority fixes before testing, others can wait until Stage 6 (error handling).
