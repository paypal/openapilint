'use strict';

const constants = {
  httpMethods: ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'],

  // braces surrounding something that does not include any braces or whitespace
  reValidPathTemplateParam: /^{[^{}\s]+}$/,

  styles: {
    'spine-case': /^[a-z0-9-]*$/,
    'cap-spine-case': /^[A-Z0-9-]*$/,
    'snake-case': /^[a-z0-9_]*$/
  }
};

module.exports = constants;
