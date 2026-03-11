/**
 * 404 handler — catches unmatched routes.
 */
export const notFound = (req, res, _next) => {
    res.status(404).json({
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
};
