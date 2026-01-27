let navigateFunction = null;

export const setNavigate = (navigate) => {
  navigateFunction = navigate;
};

export const navigateTo = (path, options = {}) => {
  if (navigateFunction) {
    navigateFunction(path, options);
  }
};

export const redirectToLogin = () => {
  navigateTo("/login", { replace: true });
};
