#!/bin/bash

# Test script for Pear Protocol API endpoints
# Usage: ./scripts/test-pear-api.sh

echo "=== PEAR PROTOCOL API TESTING ==="
echo ""

# Configuration
API_BASE="https://hl-v2.pearprotocol.io"
CLIENT_ID="HLHackathon1"
TEST_ADDRESS="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"

echo "Configuration:"
echo "API Base: $API_BASE"
echo "Client ID: $CLIENT_ID"
echo "Test Address: $TEST_ADDRESS"
echo ""

# Test 1: Health Check
echo "=== TEST 1: Health Check ==="
echo "GET $API_BASE/health"
echo ""
curl -v "$API_BASE/health" 2>&1
echo ""
echo ""

# Test 2: Get EIP712 Message
echo "=== TEST 2: Get EIP712 Message ==="
echo "GET $API_BASE/auth/eip712-message?address=$TEST_ADDRESS&clientId=$CLIENT_ID"
echo ""
curl -v "$API_BASE/auth/eip712-message?address=$TEST_ADDRESS&clientId=$CLIENT_ID" 2>&1
echo ""
echo ""

# Test 3: Check Agent Wallet Endpoint (should fail with 401)
echo "=== TEST 3: Agent Wallet Endpoint (expected 401) ==="
echo "GET $API_BASE/agentWallet"
echo ""
curl -v "$API_BASE/agentWallet" \
  -H "Authorization: Bearer FAKE_TOKEN" 2>&1
echo ""
echo ""

# Test 4: Check Positions Endpoint (should fail with 401)
echo "=== TEST 4: Positions Endpoint (expected 401) ==="
echo "GET $API_BASE/positions"
echo ""
curl -v "$API_BASE/positions" \
  -H "Authorization: Bearer FAKE_TOKEN" 2>&1
echo ""
echo ""

echo "=== TESTING COMPLETE ==="
echo ""
echo "Next steps:"
echo "1. Review responses above"
echo "2. Document findings in docs/API_TEST_RESULTS.md"
echo "3. If CORS errors appear, consider backend proxy"
echo "4. If endpoints return 404, verify with Pear team"
