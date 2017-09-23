'use strict';

const constants = {
  httpMethods: ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'],

  // braces surrounding something that does not include any braces or whitespace
  reValidPathTemplateParam: /^{[^{}\s]+}$/,

  caseStyles: {
    spine: /^[a-z0-9-]*$/,
    'cap-spine': /^[A-Z0-9-]*$/,
    snake: /^[a-z0-9_]*$/,
    any: /^[a-zA-Z0-9-_]+$/
  }
};

module.exports = constants;
