import app from './index';

const PORT = process.env.PORT || 3000;

export const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});