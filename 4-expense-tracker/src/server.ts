import app from './index';

const PORT = 3000;

export const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
