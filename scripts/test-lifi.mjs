#!/usr/bin/env node

/**
 * Test script for LI.FI SDK route discovery
 * Tests bridging from various chains to HyperEVM
 *
 * Usage: node scripts/test-lifi.mjs
 */

import { getRoutes, getChains, getTokens } from '@lifi/sdk';

console.log('=== LI.FI SDK TESTING ===\n');

// HyperEVM configuration
const HYPEREVM_CHAIN_ID = 999;
const HYPEREVM_USDC = '0xb88339cb7199b77e23db6e890353e22632ba630f';

async function testChainSupport() {
  console.log('=== TEST 1: Check Chain Support ===');

  try {
    const chains = await getChains();
    console.log(`Total chains supported: ${chains.length}`);

    const hyperEVM = chains.find(c => c.id === HYPEREVM_CHAIN_ID);
    if (hyperEVM) {
      console.log('✓ HyperEVM is supported!');
      console.log(`  Name: ${hyperEVM.name}`);
      console.log(`  Chain ID: ${hyperEVM.id}`);
    } else {
      console.log('✗ HyperEVM (chain ID 999) NOT found in supported chains');
      console.log('Available chain IDs:', chains.map(c => c.id).slice(0, 20).join(', '), '...');
    }
  } catch (error) {
    console.error('✗ Error fetching chains:', error.message);
  }

  console.log('');
}

async function testTokenSupport() {
  console.log('=== TEST 2: Check Token Support on HyperEVM ===');

  try {
    const tokens = await getTokens({ chainId: HYPEREVM_CHAIN_ID });
    console.log(`Tokens available on HyperEVM: ${tokens.length}`);

    const usdc = tokens.find(t =>
      t.address.toLowerCase() === HYPEREVM_USDC.toLowerCase()
    );

    if (usdc) {
      console.log('✓ USDC found on HyperEVM!');
      console.log(`  Symbol: ${usdc.symbol}`);
      console.log(`  Address: ${usdc.address}`);
      console.log(`  Decimals: ${usdc.decimals}`);
    } else {
      console.log('✗ USDC not found at expected address');
      console.log('Available tokens:', tokens.slice(0, 5).map(t => t.symbol).join(', '));
    }
  } catch (error) {
    console.error('✗ Error fetching tokens:', error.message);
  }

  console.log('');
}

async function testRoutesFrom(fromChainId, fromChainName, fromToken = '0x0000000000000000000000000000000000000000') {
  console.log(`=== TEST: Route Discovery ${fromChainName} → HyperEVM ===`);

  try {
    const routes = await getRoutes({
      fromChainId,
      toChainId: HYPEREVM_CHAIN_ID,
      fromTokenAddress: fromToken, // Native token (ETH/MATIC/etc)
      toTokenAddress: HYPEREVM_USDC,
      fromAmount: '10000000000000000', // 0.01 native token
      options: {
        slippage: 0.03, // 3% slippage tolerance
        order: 'FASTEST',
      },
    });

    if (routes.routes.length > 0) {
      console.log(`✓ ${routes.routes.length} route(s) found!`);

      const bestRoute = routes.routes[0];
      console.log(`  Best route:`);
      console.log(`    Tool: ${bestRoute.steps[0]?.tool || 'unknown'}`);
      console.log(`    Estimated time: ${bestRoute.steps[0]?.estimate?.executionDuration || 'unknown'}s`);
      console.log(`    Gas cost: ${bestRoute.steps[0]?.estimate?.gasCosts?.[0]?.amount || 'unknown'}`);
      console.log(`    Output: ${bestRoute.toAmount} ${bestRoute.toToken.symbol}`);
    } else {
      console.log('✗ No routes found');
    }
  } catch (error) {
    console.error(`✗ Error finding routes from ${fromChainName}:`, error.message);
  }

  console.log('');
}

async function runTests() {
  try {
    // Test 1: Chain support
    await testChainSupport();

    // Test 2: Token support
    await testTokenSupport();

    // Test 3-5: Route discovery from different chains
    await testRoutesFrom(1, 'Ethereum');
    await testRoutesFrom(42161, 'Arbitrum');
    await testRoutesFrom(8453, 'Base');
    await testRoutesFrom(10, 'Optimism');

    console.log('=== TESTING COMPLETE ===\n');
    console.log('Next steps:');
    console.log('1. Review results above');
    console.log('2. If HyperEVM not supported, check chain ID or use different bridge');
    console.log('3. If no routes found, may need to bridge to intermediate chain first');
    console.log('4. Document findings in docs/API_TEST_RESULTS.md');

  } catch (error) {
    console.error('Fatal error during testing:', error);
  }
}

runTests();
