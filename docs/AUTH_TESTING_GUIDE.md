# Authentication Flow Testing Guide
**Stage 2: Manual Testing Instructions**

---

## Prerequisites

1. Development server running: `npm run dev`
2. MetaMask installed in browser
3. Wallet with test ETH on Arbitrum (for gas)
4. Browser: Chrome or Firefox recommended

---

## Test 1: EIP-712 Signing with MetaMask

### Steps

1. **Navigate to Markets Page**
   - Open: http://localhost:3000/markets
   - Should see "AUTHENTICATION REQUIRED" banner

2. **Click "AUTHENTICATE →" Button**
   - Button located in yellow/green banner at top
   - Should trigger wallet popup

3. **Expected: MetaMask Signature Request**
   ```
   Sign Message from:
   war.market

   Message:
   address: 0x...
   clientId: HLHackathon1
   timestamp: ...
   action: authenticate
   ```

4. **Sign the Message**
   - Click "Sign" in MetaMask
   - Do NOT reject (we'll test that later)

5. **Expected Result**
   - Button changes to "[ SIGNING... ]"
   - MetaMask request appears
   - After signing, should show success

### Success Criteria
- ✅ Signature request appears
- ✅ Message structure matches EIP-712 format
- ✅ Client ID is "HLHackathon1"
- ✅ No console errors before signing

### Common Issues
- **Issue:** Nothing happens when clicking authenticate
  - **Fix:** Check console for errors
  - **Fix:** Ensure wallet is connected (click CONNECT WALLET in navbar first)

- **Issue:** MetaMask shows wrong network
  - **Fix:** Switch to Arbitrum in MetaMask
  - **Note:** EIP-712 domain uses chainId 42161 (Arbitrum)

- **Issue:** "Wallet not connected" error
  - **Fix:** Click "CONNECT WALLET" in navbar first
  - **Fix:** Accept MetaMask connection request

---

## Test 2: Complete Auth Flow (JWT Tokens)

### After signing in Test 1...

1. **Check Browser Console**
   ```javascript
   // Should see access token stored
   localStorage.getItem('pear_access_token')
   // Returns: "eyJ..." (JWT token)

   localStorage.getItem('pear_refresh_token')
   // Returns: "eyJ..." (JWT token)

   localStorage.getItem('pear_token_expiry')
   // Returns: timestamp number
   ```

2. **Expected UI Changes**
   - Yellow "AUTHENTICATION REQUIRED" banner disappears
   - "YOUR BETS" panel appears (may be empty)
   - Market cards remain visible

3. **Check Network Tab**
   - Should see successful POST to `/auth/login`
   - Response should contain:
     ```json
     {
       "accessToken": "eyJ...",
       "refreshToken": "eyJ...",
       "expiresIn": 900000
     }
     ```

### Success Criteria
- ✅ Access token stored in localStorage
- ✅ Refresh token stored in localStorage
- ✅ Token expiry set (15 minutes from now)
- ✅ UI updates to authenticated state
- ✅ No errors in console

### Common Issues
- **Issue:** 401 error on `/auth/login`
  - **Debug:** Check signature format in request payload
  - **Debug:** Verify timestamp matches EIP-712 message

- **Issue:** Tokens not saved
  - **Debug:** Check if localStorage is blocked
  - **Debug:** Verify `saveAuthTokens()` is called

---

## Test 3: Agent Wallet Creation

### After successful auth...

1. **Check Console Logs**
   ```
   Should see:
   "Checking agent wallet..."
   "Agent wallet created: 0x..."
   OR
   "Agent wallet exists: 0x..."
   ```

2. **Check localStorage**
   ```javascript
   // Agent wallet address should be stored
   // (Check usePear hook state, not localStorage directly)
   ```

3. **Check Network Tab**
   - GET request to `/agentWallet` with Bearer token
   - If 404: POST request to `/agentWallet` follows
   - Response contains wallet address

### Success Criteria
- ✅ Agent wallet address received
- ✅ No 401 errors (token is valid)
- ✅ Wallet address is Ethereum format (0x...)

### Common Issues
- **Issue:** 401 on `/agentWallet`
  - **Debug:** Token may have expired
  - **Debug:** Check Authorization header format

- **Issue:** POST `/agentWallet` fails
  - **Debug:** Check error message in response
  - **Debug:** May need manual approval on Hyperliquid

---

## Test 4: Token Persistence

### Steps

1. **After successful auth, refresh page**
   - Press F5 or Cmd+R
   - Page reloads

2. **Expected Result**
   - Should REMAIN authenticated (no yellow banner)
   - "YOUR BETS" panel should still be visible
   - No re-authentication required

3. **Check Console**
   ```javascript
   // On page load, should see:
   "Loading saved token..."
   "Token valid, fetching agent wallet..."
   ```

### Success Criteria
- ✅ Authentication persists across refresh
- ✅ No re-signing required
- ✅ Agent wallet loaded from token

### Common Issues
- **Issue:** Auth state lost on refresh
  - **Debug:** Check if tokens are in localStorage
  - **Debug:** Verify `useEffect` in usePear.ts runs

---

## Test 5: Error Handling

### Test 5a: Rejected Signature

1. Click "AUTHENTICATE →"
2. When MetaMask appears, click "Cancel" or "Reject"
3. **Expected:**
   - Error message appears (toast or console)
   - Button returns to "AUTHENTICATE →"
   - No crash or freeze

### Test 5b: Disconnected Wallet

1. Authenticate successfully
2. Disconnect wallet in MetaMask
3. Refresh page
4. **Expected:**
   - Should show "CONNECT WALLET" again
   - Auth state should clear

### Test 5c: Expired Token

1. Authenticate successfully
2. In console, manually expire token:
   ```javascript
   localStorage.setItem('pear_token_expiry', '0');
   ```
3. Refresh page
4. **Expected:**
   - Should require re-authentication
   - Yellow banner appears again

---

## Test 6: Multi-Tab Behavior

1. **Open app in Tab 1**
   - Authenticate successfully

2. **Open app in Tab 2** (same browser)
   - Should auto-authenticate (shared localStorage)

3. **Disconnect in Tab 1**
   - Check Tab 2 behavior (may need to handle this)

### Expected (Current Implementation)
- Auth state is per-tab (not synced)
- Tokens are shared via localStorage
- Refreshing Tab 2 should pick up Tab 1's tokens

### Improvement Needed
- Listen to `storage` events to sync auth across tabs

---

## Troubleshooting

### Issue: "Failed to get EIP712 message"
**Possible causes:**
1. API is down (check health endpoint)
2. CORS issue (check console for CORS errors)
3. Client ID rejected

**Debug:**
```bash
# Test API directly
curl "https://hl-v2.pearprotocol.io/auth/eip712-message?address=YOUR_ADDRESS&clientId=HLHackathon1"
```

### Issue: Signature verification fails
**Possible causes:**
1. Wrong chain ID in signature
2. Address casing mismatch (checksummed vs lowercase)
3. Timestamp mismatch

**Debug:**
- Check exact payload sent to `/auth/login`
- Verify signature was generated with correct domain

### Issue: Agent wallet creation fails
**Possible causes:**
1. Token is invalid/expired
2. Agent wallet requires manual approval on Hyperliquid
3. API endpoint expects different request format

**Debug:**
```bash
# Test with valid token (get from localStorage)
curl -X POST https://hl-v2.pearprotocol.io/agentWallet \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Success Metrics

**Stage 2 Complete When:**
- ✅ User can authenticate with wallet
- ✅ Access/refresh tokens are received and stored
- ✅ Agent wallet is created or retrieved
- ✅ Auth state persists across refresh
- ✅ Error cases handled gracefully (reject, disconnect, expire)

**Document Issues:**
- Record any errors encountered
- Note response format mismatches
- Save actual API responses for comparison

---

## Next Steps

After completing Stage 2:
- **Stage 3:** Validate market configurations (test which assets Pear supports)
- **Stage 4:** Test bridge integration (LI.FI route execution)
- **Stage 5:** Test position execution (place actual bets)

---

## Quick Test Checklist

```
[ ] Server running (localhost:3000)
[ ] Wallet connected
[ ] Click authenticate
[ ] Sign message in MetaMask
[ ] Check tokens in localStorage
[ ] Verify agent wallet created
[ ] Refresh page - should stay authenticated
[ ] Test reject signature
[ ] Test expired token
[ ] Document all issues
```

---

## Testing URL

**Main page:** http://localhost:3000
**Markets page:** http://localhost:3000/markets

**Open browser console:** `Cmd+Option+I` (Mac) or `F12` (Windows/Linux)
