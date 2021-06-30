const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

isEmpty = (text) => {
  return text.trim().length === 0 ? true : false;
};

isEmail = (email) => {
  return email.match(emailRegex);
};

exports.validateRegister = (data) => {
  let error = {};
  if (isEmpty(data.email)) error.email = 'Must not be empty';
  else if (!isEmail(data.email)) error.email = 'Please enter valid email.';
  if (isEmpty(data.password)) error.password = 'Must not be empty';
  if (isEmpty(data.playerName)) error.playerName = 'Must not be empty';
  if (data.password !== data.confirmPassword)
    error.confirmPassword = "Password don't match";
  console.log(error);
  return { error, valid: Object.keys(error).length === 0 ? true : false };
};

exports.validateLogin = (data) => {
  let error = {};
  if (isEmpty(data.email)) error.email = 'Must not be empty';
  else if (!isEmail(data.email)) error.email = 'Please enter valid email.';
  if (isEmpty(data.password)) error.password = 'Must not be empty';
  return { error, valid: Object.keys(error).length === 0 ? true : false };
};
