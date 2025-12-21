./node_modules/fontkit/dist/module.mjs
./node_modules/pdfkit/js/pdfkit.es.js
./app/api/quiz-results/route.ts
   Linting and checking validity of types ...
Failed to compile.
./app/api/audit/report/route.ts:623:29
Type error: Argument of type 'Uint8Array<ArrayBufferLike>' is not assignable to parameter of type 'BodyInit | null | undefined'.
  Type 'Uint8Array<ArrayBufferLike>' is missing the following properties from type 'URLSearchParams': size, append, delete, get, and 2 more.
  621 |     const pdfBytes = await generatePDF(data);
  622 |
> 623 |     return new NextResponse(pdfBytes, {
      |                             ^
  624 |       status: 200,
  625 |       headers: {
  626 |         "Content-Type": "application/pdf",
Error: Command "npm run build" exited with 1
Deployment Summary
Deployment Checks
