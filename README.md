
# zimbra-auth-logger-ts
A TypeScript utility to log Zimbra authentication attempts (both successful and failed), including the client IP address, aiding in brute-force attack detection.

**Dependencies:**
- TypeScript
- Node.js
- Perl

**Usage:**
1. Install Node.js and TypeScript if not already installed.
2. Clone the repository.
3. Install dependencies using `npm install`.
4. Configure the `.env` file based on the provided `.env.example` file.
5. Build the program using `npm run build`
6. Run the program using `npm start` or `npm run start`.

**Features:**
- Logs authentication attempts and failed authentication attempts.
- Sends logs including IP addresses for monitoring.
- Configurable via `.env` file.
- Utilizes Perl for parsing Zimbra logs.
