# Authentication (Firecrawl extract)

Source: `https://docs.pearprotocol.io/api-integration/api-specification/authentication`

---

### [hashtag](https://docs.pearprotocol.io/api-integration/api-specification/authentication\#post-auth-login)    Authenticate user

post

https://hl-v2.pearprotocol.io/auth/login

Authenticate a user using EIP712 signature or API key and return access/refresh tokens

Body

application/jsonchevron-down

application/json

methodstring · enumRequired

Authentication method

Example: `eip712`Possible values:`eip712``api_key``privy_access_token`

addressstringRequired

User wallet address

Example: `0x1234567890123456789012345678901234567890`Pattern: `^0x[a-fA-F0-9]{40}$`

clientIdstringRequired

Client identifier

Example: `phantom-exchange`

detailsone ofRequired

Authentication method specific details

objectOptional

Show propertiesplus

or

objectOptional

Show propertiesplus

Responses

chevron-right

200

Authentication successful

application/json

Responseobject

Show propertiesplus

chevron-right

400

Bad request - invalid input data

chevron-right

401

Unauthorized - authentication failed

post

/auth/login

HTTPchevron-down

HTTPcURLJavaScriptPython

Copy

```
POST /auth/login HTTP/1.1
Host: hl-v2.pearprotocol.io
Content-Type: application/json
Accept: */*
Content-Length: 175

{
  "method": "eip712",
  "address": "0x1234567890123456789012345678901234567890",
  "clientId": "phantom-exchange",
  "details": {
    "signature": "0x1234567890abcdef...",
    "timestamp": 1703872800
  }
}
```

Test it

200

Authentication successful

chevron-down

Copy

```
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "address": "0x1234567890123456789012345678901234567890",
  "clientId": "phantom-exchange"
}
```

### [hashtag](https://docs.pearprotocol.io/api-integration/api-specification/authentication\#get-auth-eip712-message)    Get EIP712 message to sign

get

https://hl-v2.pearprotocol.io/auth/eip712-message

Generate EIP712 structured data for client-side signing

Query parameters

addressstringRequired

User wallet address

Example: `0x1234567890123456789012345678901234567890`

clientIdstringRequired

Client identifier

Example: `phantom-exchange`

Responses

chevron-right

200

EIP712 message generated successfully

application/json

Responseobject

Show propertiesplus

chevron-right

400

Bad request - invalid parameters

get

/auth/eip712-message

HTTPchevron-down

HTTPcURLJavaScriptPython

Copy

```
GET /auth/eip712-message?address=0x1234567890123456789012345678901234567890&clientId=phantom-exchange HTTP/1.1
Host: hl-v2.pearprotocol.io
Accept: */*
```

Test it

200

EIP712 message generated successfully

chevron-down

Copy

```
{
  "domain": {
    "name": "Pear Protocol",
    "version": "1",
    "chainId": 1,
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "types": {
    "Authentication": [\
      {\
        "name": "address",\
        "type": "address"\
      },\
      {\
        "name": "clientId",\
        "type": "string"\
      },\
      {\
        "name": "timestamp",\
        "type": "uint256"\
      },\
      {\
        "name": "action",\
        "type": "string"\
      }\
    ]
  },
  "primaryType": "Authentication",
  "message": {
    "address": "0x1234567890123456789012345678901234567890",
    "clientId": "phantom-exchange",
    "timestamp": 1703872800,
    "action": "authenticate"
  },
  "timestamp": 1703872800
}
```

### [hashtag](https://docs.pearprotocol.io/api-integration/api-specification/authentication\#post-auth-refresh)    Refresh access token

post

https://hl-v2.pearprotocol.io/auth/refresh

Use a valid refresh token to obtain a new access token and refresh token

Body

application/jsonchevron-down

application/json

refreshTokenstringRequired

Refresh token

Example: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...`

Responses

chevron-right

200

Token refresh successful

application/json

Responseobject

Show propertiesplus

chevron-right

401

Unauthorized - invalid or expired refresh token

post

/auth/refresh

HTTPchevron-down

HTTPcURLJavaScriptPython

Copy

```
POST /auth/refresh HTTP/1.1
Host: hl-v2.pearprotocol.io
Content-Type: application/json
Accept: */*
Content-Length: 58

{
  "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Test it

200

Token refresh successful

chevron-down

Copy

```
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 900
}
```

