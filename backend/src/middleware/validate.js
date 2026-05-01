function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fields = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".") || "_";
        if (!fields[path]) fields[path] = [];
        fields[path].push(issue.message);
      }
      return res.status(400).json({
        error: "Validation failed",
        fields,
      });
    }
    req.validated = result.data;
    next();
  };
}

module.exports = { validate };
