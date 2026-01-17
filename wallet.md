# Wallet connection notes (WAR.MARKET)

This doc captures what we implemented, what failed in real usage, and what to do next.

## Current goal

- Keep a **multi-wallet picker** (Rabby/Phantom/etc) **and** include **MetaMask** when it exists.
- Avoid user confusion where UI says “MetaMask” but the browser only has Rabby/Phantom installed.
- Keep the flow simple for the hackathon demo: connect → authenticate (EIP-712) → bet.

## What the user observed (failure)

User screenshot shows a system/extension-driven picker:

- Title: “Select a Wallet to Connect”
- Wallets listed: **Rabby Wallet**, **Phantom**
- **MetaMask is NOT present**

This was interpreted as “our app isn’t offering MetaMask”.

## Root cause (why MetaMask didn’t show)

The “Select a Wallet to Connect” UI only lists **wallets installed/enabled in that browser profile**.

If MetaMask is not installed/enabled (or is disabled / not present in the profile), it cannot appear as an option.

Even if the app adds a MetaMask connector, MetaMask will not show up unless the browser has:

- a MetaMask provider in `window.ethereum` (or inside `window.ethereum.providers[]`), typically via the MetaMask extension.

In the screenshot, the installed providers appear to be Rabby + Phantom, so MetaMask being absent is expected.

## What we tried / changed (sequence)

### Attempt A (not desired): “Force MetaMask only”

- We switched wagmi connectors from `injected()` to `metaMask()` to avoid the multi-wallet injected picker.
- This prevents showing Rabby/Phantom and tries to go straight to MetaMask.

Outcome:
- It conflicted with user intent (user wants multi-wallet picker).
- It also still can’t make MetaMask appear if MetaMask isn’t installed.

### Attempt B (desired): “Multi-wallet + explicit MetaMask option”

We restored multi-wallet behavior and also included MetaMask explicitly:

- **wagmi connectors**: `metaMask()` + `injected()`
- **Connect UI**: `CONNECT WALLET` opens an app-level modal listing:
  - **MetaMask**
  - **Injected wallets (Rabby/Phantom/etc)** (which may open the external wallet picker)

### UX patch (clarity): MetaMask detection + copy fix

We updated the modal to:

- detect whether MetaMask is present in the current browser profile
- if not present, show MetaMask as **disabled** with “Not installed”
- change the `/markets` auth gate button label from **CONNECT METAMASK →** to **CONNECT WALLET →**

This prevents the confusing situation where UI promises MetaMask but the picker shows Rabby/Phantom only.

## Current behavior (as shipped)

- Navbar: **CONNECT WALLET** opens the app modal:
  - “MetaMask” (enabled only if detected)
  - “Injected Wallets (Rabby/Phantom/etc)”
- Markets page auth gate:
  - shows **CONNECT WALLET →** if not connected
  - opens the same app modal

## Files involved

- `src/lib/wagmi.ts`
  - wagmi config uses `connectors: [metaMask(), injected()]`
- `src/components/WalletConnectModal.tsx`
  - app-level modal listing MetaMask + Injected
  - MetaMask detection via:
    - `window.ethereum.isMetaMask`
    - `window.ethereum.providers?.some(p => p.isMetaMask)`
- `src/components/ConnectButton.tsx`
  - opens the modal
- `src/app/markets/page.tsx`
  - uses modal when user tries to bet/auth while disconnected

## What is “working”

- Connecting via **Rabby** (and other injected wallets) works.
- Pear auth (EIP-712 → JWT), balances, bet execution, and positions UI work after connection.

## What is “not working” (or not possible)

- You cannot “turn on” MetaMask in a picker if MetaMask is not installed/enabled in the current browser profile.
- The external “Select a Wallet to Connect” sheet is controlled by wallet extensions / injected-provider discovery; the app cannot force it to list wallets that don’t exist.

## How the other dev can verify quickly

In the browser console:

```js
window.ethereum
window.ethereum?.isMetaMask
window.ethereum?.providers?.map(p => ({ isMetaMask: !!p.isMetaMask, name: p?.name, isRabby: !!p.isRabby }))
```

Expected:
- If MetaMask is installed/enabled: one provider should have `isMetaMask === true`.
- If not: no provider will report `isMetaMask === true`, and MetaMask won’t be connectable.

## Recommended next steps (if we want “best-in-class” wallet UX)

If you want a robust multi-wallet UX without hand-rolled modals:

- Adopt a wallet UI kit:
  - **RainbowKit** (wagmi-native)
  - **Web3Modal**
  - **ConnectKit**

These handle:
- connector grouping (MetaMask vs injected vs WalletConnect)
- better detection and messaging
- fewer edge cases across browsers

If you want to support mobile/QR:
- add **WalletConnect** connector as well (separate decision; currently not required for hackathon demo).

