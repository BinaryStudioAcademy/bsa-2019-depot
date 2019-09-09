export const getBranchName = (branches, branchId) => {
  if (!branches || !Array.isArray(branches) || !branches.length) {
    return null;
  }

  const branch = branches.find(({ id }) => id === branchId);
  return branch ? branch.name : null;
};
