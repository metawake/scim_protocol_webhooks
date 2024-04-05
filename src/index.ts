import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`SCIM API available at http://localhost:${PORT}/scim/v2`);
  console.log(`Webhook endpoint available at http://localhost:${PORT}/scim/v2/webhook/users`);
}); 