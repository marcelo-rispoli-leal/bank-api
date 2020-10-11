export const swaggerDoc = {
  openapi: '3.0.1',
  info: {
    title: 'BAAS - Bank As A Service',
    description: 'This is a sample and fictitious Bank API.',
    contact: {
      email: 'marcelorispoli@gmail.com',
    },
    version: '1.0.0',
  },
  servers: [
    {
      url: process.env.HOST,
    },
  ],
  tags: [
    {
      name: 'auth',
      description:
        'The user creates his registration, performs his authentication, informs that forgot his password and resets it.',
    },
    {
      name: 'user',
      description: 'Retrieves, updates and deletes users data.',
    },
    {
      name: 'account',
      description:
        'Creates and retrieves data of bank accounts and transactions.',
    },
  ],
  paths: {
    //#region auth tag
    '/auth/register': {
      post: {
        tags: ['auth'],
        summary: 'User creation',
        description: 'User self registration',
        requestBody: {
          description: 'Request body for the user to create his registration.',
          content: {
            'multipart/form-data': {
              schema: { $ref: '#/components/requestBodies/authRegister' },
              encoding: { file: { contentType: 'application/pdf' } },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/authRegister' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  invalidPDF: { $ref: '#/components/responses/invalidPDF' },
                  requiredBody: { $ref: '#/components/responses/requiredBody' },
                  requiredFields: {
                    value: {
                      error:
                        "The fields 'name', 'CPForCNPJ', 'email', 'password' " +
                        'are required in this request, but the fields ' +
                        "'name', 'email' have been omitted.",
                    },
                  },
                  invalidCPForCNPJ: {
                    $ref: '#/components/responses/invalidCPForCNPJ',
                  },
                  invalidEmail: { $ref: '#/components/responses/invalidEmail' },
                  userAlreadyExists: {
                    value: {
                      error:
                        "User with CPF '123.456.789-09' already registered.",
                    },
                  },
                },
              },
            },
          },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
      },
    },
    '/auth/authenticate': {
      post: {
        tags: ['auth'],
        summary: 'User authentication',
        description: 'User authenticates and gets the API usage token.',
        requestBody: {
          description: 'Request body for the user authentication in the API.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/authAuthenticate' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/authAuthenticate' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredBody: { $ref: '#/components/responses/requiredBody' },
                  requiredFields: {
                    value: {
                      error:
                        "The fields 'CPForCNPJ', 'password' are required in this " +
                        "request, but the field 'password' has been omitted.",
                    },
                  },
                  invalidCPForCNPJ: {
                    $ref: '#/components/responses/invalidCPForCNPJ',
                  },
                  invalidUserPass: {
                    value: {
                      error: 'Incorret password informed.',
                    },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/userNotFound' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
      },
    },
    '/auth/forgot_pass': {
      post: {
        tags: ['auth'],
        summary: 'User forgot password',
        description:
          'User informs that he forgot the password to receive ' +
          'email containing the password reset token.',
        requestBody: {
          description:
            'Request body for the user to inform that he forgot his password.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/requiredCPForCNPJ' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/success' },
                example: { success: 'Forgot password email sended.' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredBody: { $ref: '#/components/responses/requiredBody' },
                  requiredField: {
                    value: {
                      error:
                        "The field 'CPForCNPJ' is required in this request " +
                        'but has been omitted.',
                    },
                  },
                  invalidCPForCNPJ: {
                    $ref: '#/components/responses/invalidCPForCNPJ',
                  },
                  sendMailFailed: {
                    value: {
                      error:
                        'Error on send email with subject ' +
                        "'Forgot your password?' to address 'example@email.com'",
                    },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/userNotFound' },
          500: { $ref: '#/components/responses/unexpectednalError' },
        },
      },
    },
    '/auth/reset_pass': {
      post: {
        tags: ['auth'],
        summary: 'User reset password',
        description:
          'User informs his CPF or CNPJ, the password reset token ' +
          'received by email and the new access password.',
        requestBody: {
          description:
            'Request body for the user to reset his password in the API.',
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/authResetPass' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/success' },
                example: { success: 'Password redefined.' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredBody: { $ref: '#/components/responses/requiredBody' },
                  requiredFields: {
                    value: {
                      error:
                        "The fields 'CPForCNPJ', 'password', 'token' are required " +
                        "in this request, but the field 'token' has been omitted.",
                    },
                  },
                  invalidCPForCNPJ: {
                    $ref: '#/components/responses/invalidCPForCNPJ',
                  },
                  invalidResetToken: {
                    value: {
                      error: 'Incorrect token for password reset informed.',
                    },
                  },
                  expiredResetToken: {
                    value: {
                      error:
                        'Token for password reset expired. Request a new one.',
                    },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/userNotFound' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
      },
    },
    //#endregion

    //#region user tag
    '/user/details': {
      get: {
        tags: ['user'],
        summary: 'Authenticated user gets his own data.',
        description: 'Authenticated user gets his registration details.',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/userDetails',
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/details/{CPForCNPJ}': {
      get: {
        tags: ['user'],
        summary: "Worker gets a user's details",
        description: "Worker informs a user's CPF or CNPJ to get your data.",
        parameters: [{ $ref: '#/components/parameters/CPForCNPJ' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/userDetails',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredParams: {
                    $ref: '#/components/responses/requiredParams',
                  },
                  requiredCPForCNPJ: {
                    $ref: '#/components/responses/requiredCPForCNPJ',
                  },
                  invalidCPForCNPJ: {
                    $ref: '#/components/responses/invalidCPForCNPJ',
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: { $ref: '#/components/responses/userNotFound' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/list': {
      get: {
        tags: ['user'],
        summary: 'Workers gets a list of all users with a name filter.',
        description:
          'Workers gets a list of users with an optional name snippet filter.',
        parameters: [{ $ref: '#/components/parameters/nameSnippet' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/userList',
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: {
            description: 'Not Found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                example: {
                  error:
                    "Users with case-insensitive name containing 'XYZ' not found.",
                },
              },
            },
          },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/list/{userCategory}': {
      get: {
        tags: ['user'],
        summary: 'Workers gets a list of users by category with a name filter.',
        description:
          'Workers gets a list of users with an optional name snippet filter.',
        parameters: [
          { $ref: '#/components/parameters/userCategory' },
          { $ref: '#/components/parameters/nameSnippet' },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/userList',
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: {
            description: 'Not Found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  physicalPersonsNotFound: {
                    value: {
                      error:
                        "Physical person users with case-insensitive name containing 'XYZ' not found.",
                    },
                  },
                  legalPersonsNotFound: {
                    value: {
                      error:
                        "Legal person users with case-insensitive name containing 'XYZ' not found.",
                    },
                  },
                  workersNotFound: {
                    value: {
                      error:
                        "Worker users with case-insensitive name containing 'XYZ' not found.",
                    },
                  },
                  uncheckedUsersNotFound: {
                    value: {
                      error:
                        "Unchecked users with case-insensitive name containing 'XYZ' not found.",
                    },
                  },
                },
              },
            },
          },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/register': {
      put: {
        tags: ['user'],
        summary: 'Authenticated user updates his own data.',
        description: 'Authenticated user updates his own email and phones.',
        requestBody: {
          description: 'Request body for the user updates his own data.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/userRegister' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/userRegister',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredBody: { $ref: '#/components/responses/requiredBody' },
                  requiredFields: {
                    value: {
                      error:
                        "The fields 'email', 'mobilePhone', 'fixedPhone' " +
                        'are required in this request, but the field ' +
                        "'email' has been omitted.",
                    },
                  },
                  invalidEmail: { $ref: '#/components/responses/invalidEmail' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/setEmail': {
      patch: {
        tags: ['user'],
        summary: 'Authenticated user updates his email.',
        description: 'Authenticated user updates his own email.',
        requestBody: {
          description: 'Request body for the user updates his own email.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/userSetEmail' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/userPatch',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredBody: { $ref: '#/components/responses/requiredBody' },
                  requiredField: {
                    value: {
                      error:
                        "The field 'email' is required in this request, " +
                        'but has been omitted.',
                    },
                  },
                  invalidEmail: { $ref: '#/components/responses/invalidEmail' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/setMobile': {
      patch: {
        tags: ['user'],
        summary: 'Authenticated user updates his cell phone.',
        description: 'Authenticated user updates his own mobile phone number.',
        requestBody: {
          description: 'Request body for the user updates his own cell phone.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/userSetMobile' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/userSetMobile',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredBody: { $ref: '#/components/responses/requiredBody' },
                  requiredField: {
                    value: {
                      error:
                        "The field 'mobilePhone' is required in this request, " +
                        'but has been omitted.',
                    },
                  },
                  invalidPhone: {
                    value: {
                      error:
                        "The number '1199998888' is not a valid Brazilian " +
                        'mobile phone according to Google rules.',
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/setLandline': {
      patch: {
        tags: ['user'],
        summary: 'Authenticated user updates his landline.',
        description: 'Authenticated user updates his own fixed phone number.',
        requestBody: {
          description: 'Request body for the user updates his own landline.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/userSetLandline' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/userSetLandline',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredBody: { $ref: '#/components/responses/requiredBody' },
                  requiredField: {
                    value: {
                      error:
                        "The field 'fixedPhone' is required in this request, " +
                        'but has been omitted.',
                    },
                  },
                  invalidPhone: {
                    value: {
                      error:
                        "The number '11333334444' is not a valid Brazilian " +
                        'fixed phone according to Google rules.',
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/setName': {
      patch: {
        tags: ['user'],
        summary: 'Authenticated non-customer user updates his name.',
        description: 'Authenticated non-customer user updates his own name.',
        requestBody: {
          description: 'Request body for the user updates his own name.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/userSetName' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/userPatch',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredBody: { $ref: '#/components/responses/requiredBody' },
                  requiredField: {
                    value: {
                      error:
                        "The field 'name' is required in this request, " +
                        'but has been omitted.',
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/userAccessOnly' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/setFile': {
      patch: {
        tags: ['user'],
        summary: 'Authenticated non-customer user updates his own PDF file.',
        description:
          'Authenticated non-customer user updates his PDF documentation file.',
        requestBody: {
          description: 'Request body for the user updates his own PDF file.',
          content: {
            'multipart/form-data': {
              schema: { $ref: '#/components/requestBodies/userSetFile' },
              encoding: { file: { contentType: 'application/pdf' } },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/userSetFile',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  invalidPDF: { $ref: '#/components/responses/invalidPDF' },
                  requiredPDF: {
                    value: {
                      error:
                        'This request must have a PDF file uploaded. The account ' +
                        'is created after sending and approving the documentation.',
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/userAccessOnly' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/setWorker': {
      patch: {
        tags: ['user'],
        summary: 'Worker grants worker access privileges to a user.',
        description:
          'Worker user grants worker access privileges to another user.',
        requestBody: {
          description: 'Request body for grants worker privileges to a user.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/requiredCPF' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/userSetWorker',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredBody: { $ref: '#/components/responses/requiredBody' },
                  requiredCPF: { $ref: '#/components/responses/requiredCPF' },
                  invalidCPF: { $ref: '#/components/responses/invalidCPF' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: { $ref: '#/components/responses/userNotFound' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/setWorker/revoke': {
      patch: {
        tags: ['user'],
        summary: 'Worker revokes worker access privileges to a user.',
        description:
          'Worker user revokes worker access privileges to another user.',
        requestBody: {
          description: 'Request body for revokes worker privileges to a user.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/requiredCPF' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/userUnsetWorker',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredBody: { $ref: '#/components/responses/requiredBody' },
                  requiredCPF: { $ref: '#/components/responses/requiredCPF' },
                  invalidCPF: { $ref: '#/components/responses/invalidCPF' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: { $ref: '#/components/responses/userNotFound' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/delete': {
      delete: {
        tags: ['user'],
        summary: 'Authenticated user deletes his registration.',
        description: 'Authenticated user deletes his own registration.',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/success',
                },
                example: {
                  success: "User '123.456.789-09' deleted.",
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/responseError',
                },
                example: {
                  error:
                    "Operation not allowed. To delete the account '100000000' " +
                    "the balance must be zero, but the current amount is '0.01'.",
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    //#endregion

    //#region account tag
    '/account/register': {
      post: {
        tags: ['account'],
        summary: 'Account creation',
        description: 'Worker creates a bank account to an user.',
        requestBody: {
          description: 'Request body for the worker creates an account.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/requiredCPForCNPJ' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/accountRegister' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredBody: { $ref: '#/components/responses/requiredBody' },
                  requiredCPForCNPJ: {
                    $ref: '#/components/responses/requiredCPForCNPJ',
                  },
                  invalidCPForCNPJ: {
                    $ref: '#/components/responses/invalidCPForCNPJ',
                  },
                  userAlreadyIsCustomer: {
                    value: {
                      error:
                        "User with CPF '123.456.789-09' already is customer.",
                    },
                  },
                  requiredPDF: {
                    value: {
                      error:
                        "The user didn't upload a file. The account is " +
                        'created after sending and approving the documentation.',
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: { $ref: '#/components/responses/userNotFound' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/transfer': {
      post: {
        tags: ['account'],
        summary: 'Transfer transaction creation',
        description:
          'The customer creates a transfer of values between accounts of this bank.',
        requestBody: {
          description: 'Request body for the customer creates a transfer.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/accountTransfer' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/accountTransfer' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredBody: { $ref: '#/components/responses/requiredBody' },
                  requiredFields: {
                    value: {
                      error:
                        "The fields 'destinyAccount', 'value' are required in " +
                        "this request, but the field 'value' has been omitted.",
                    },
                  },
                  valueIsNaN: { $ref: '#/components/responses/valueIsNaN' },
                  valueLessMinimum: {
                    $ref: '#/components/responses/valueLessMinimum',
                  },
                  destinyAccountIsNaN: {
                    value: {
                      error:
                        "The destiny account must be a number, but 'abcdefghi' is not.",
                    },
                  },
                  destinyAccountLessMinimum: {
                    value: {
                      error:
                        "The destiny account must be equal or greater than '100000000', " +
                        "but '99999999' is not.",
                    },
                  },
                  destinyAccountGreaterMaximum: {
                    value: {
                      error:
                        "The destiny account must be equal or less than '999999999', " +
                        "but '1000000000' is not.",
                    },
                  },
                  invalidAccounts: {
                    value: {
                      error:
                        'Invalid accounts. The source and destiny accounts ' +
                        'must be different, but they are the same.',
                    },
                  },
                  invalidTransaction: {
                    $ref: '#/components/responses/invalidTransaction',
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/customerAccessOnly' },
          404: { $ref: '#/components/responses/accountNotFound' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/debit': {
      post: {
        tags: ['account'],
        summary: 'Debit transaction creation',
        description:
          'The customer creates a debit of values in your bank account.' +
          'We emphasize that this API was developed for sampling and testing. ' +
          'We know that a customer does not directly debit his account, ' +
          'he makes payments, withdrawals. This is just a fictional example.',
        requestBody: {
          description:
            'Request body for the customer creates a debit transaction.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/requiredValue' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/accountDebit' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredBody: { $ref: '#/components/responses/requiredBody' },
                  requiredValue: {
                    $ref: '#/components/responses/requiredValue',
                  },
                  valueIsNaN: { $ref: '#/components/responses/valueIsNaN' },
                  valueLessMinimum: {
                    $ref: '#/components/responses/valueLessMinimum',
                  },
                  invalidTransaction: {
                    $ref: '#/components/responses/invalidTransaction',
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/customerAccessOnly' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/credit': {
      post: {
        tags: ['account'],
        summary: 'Credit transaction creation',
        description:
          'The customer creates a credit of values in your bank account.' +
          'We emphasize that this API was developed for sampling and testing. ' +
          'We know that a customer does not directly credit his account, he ' +
          'makes deposits, receives transfers. This is just a fictional example.',
        requestBody: {
          description:
            'Request body for the customer creates a credit transaction.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/requiredValue' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/accountCredit' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredBody: { $ref: '#/components/responses/requiredBody' },
                  requiredValue: {
                    $ref: '#/components/responses/requiredValue',
                  },
                  valueIsNaN: { $ref: '#/components/responses/valueIsNaN' },
                  valueLessMinimum: {
                    $ref: '#/components/responses/valueLessMinimum',
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/customerAccessOnly' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/balance': {
      get: {
        tags: ['account'],
        summary: 'Customer gets his available balance.',
        description:
          'The customer gets the balance available in his own account.',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/accountBalance' },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/customerAccessOnly' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/balance/{accountNumber}': {
      get: {
        tags: ['account'],
        summary: 'Worker gets the available balance of an account.',
        description:
          'The worker gets the balance available in a customer account.',
        parameters: [{ $ref: '#/components/parameters/accountNumber' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/customerBalance' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredParams: {
                    $ref: '#/components/responses/requiredParams',
                  },
                  requiredAccount: {
                    $ref: '#/components/responses/requiredAccount',
                  },
                  accountIsNaN: { $ref: '#/components/responses/accountIsNaN' },
                  accountLessMinimum: {
                    $ref: '#/components/responses/accountLessMinimum',
                  },
                  accountGreaterMaximum: {
                    $ref: '#/components/responses/accountGreaterMaximum',
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: { $ref: '#/components/responses/accountNotFound' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/details': {
      get: {
        tags: ['account'],
        summary:
          'Customer gets the account transactions in the current or informed period.',
        description:
          'The customer gets the detail of the transactions from his own account ' +
          'in the current or informed period.',
        parameters: [
          { $ref: '#/components/parameters/accountNumber' },
          { $ref: '#/components/parameters/period' },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/accountDetails' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  invalidPeriod: {
                    $ref: '#/components/responses/invalidPeriod',
                  },
                  periodIsNaD: { $ref: '#/components/responses/periodIsNaD' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/customerAccessOnly' },
          404: {
            $ref: '#/components/responses/transactionsByAccountInMonthNotFound',
          },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/details/{accountNumber}': {
      get: {
        tags: ['account'],
        summary:
          'Worker gets the transactions of an account ' +
          'in the current or informed period.',
        description:
          'The worker gets the detail of the transactions of a customer account ' +
          'in the current or informed period.',
        parameters: [{ $ref: '#/components/parameters/accountNumber' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/accountDetails' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredParams: {
                    $ref: '#/components/responses/requiredParams',
                  },
                  requiredAccount: {
                    $ref: '#/components/responses/requiredAccount',
                  },
                  accountIsNaN: { $ref: '#/components/responses/accountIsNaN' },
                  accountLessMinimum: {
                    $ref: '#/components/responses/accountLessMinimum',
                  },
                  accountGreaterMaximum: {
                    $ref: '#/components/responses/accountGreaterMaximum',
                  },
                  invalidPeriod: {
                    $ref: '#/components/responses/invalidPeriod',
                  },
                  periodIsNaD: { $ref: '#/components/responses/periodIsNaD' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: {
            $ref: '#/components/responses/accountTransactionsInMonthNotFound',
          },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/summary/daily': {
      get: {
        tags: ['account'],
        summary:
          'Customer gets the daily summary of transactions ' +
          'in the current or informed period.',
        description:
          'The customer gets the daily summary of the transactions from ' +
          'his own account in the current or informed period.',
        parameters: [{ $ref: '#/components/parameters/period' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/accountSummaryDaily',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  invalidPeriod: {
                    $ref: '#/components/responses/invalidPeriod',
                  },
                  periodIsNaD: { $ref: '#/components/responses/periodIsNaD' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/customerAccessOnly' },
          404: {
            $ref: '#/components/responses/transactionsByAccountInMonthNotFound',
          },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/summary/daily/{accountNumber}': {
      get: {
        tags: ['account'],
        summary:
          'Worker gets the daily summary of transactions of an account ' +
          'in the current or informed period.',
        description:
          'The worker gets the daily summary of the transactions of a customer ' +
          'account in the current or informed period.',
        parameters: [
          { $ref: '#/components/parameters/accountNumber' },
          { $ref: '#/components/parameters/period' },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/accountSummaryDaily',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredParams: {
                    $ref: '#/components/responses/requiredParams',
                  },
                  requiredAccount: {
                    $ref: '#/components/responses/requiredAccount',
                  },
                  accountIsNaN: { $ref: '#/components/responses/accountIsNaN' },
                  accountLessMinimum: {
                    $ref: '#/components/responses/accountLessMinimum',
                  },
                  accountGreaterMaximum: {
                    $ref: '#/components/responses/accountGreaterMaximum',
                  },
                  invalidPeriod: {
                    $ref: '#/components/responses/invalidPeriod',
                  },
                  periodIsNaD: { $ref: '#/components/responses/periodIsNaD' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: {
            $ref: '#/components/responses/accountTransactionsInMonthNotFound',
          },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/summary/monthly': {
      get: {
        tags: ['account'],
        summary:
          'Customer gets the monthly summary of transactions ' +
          'in the current or informed year.',
        description:
          'The customer gets the monthly summary of the transactions from ' +
          'his own account in the current or informed year.',
        parameters: [{ $ref: '#/components/parameters/year' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/accountSummaryMonthly',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  invalidYear: {
                    $ref: '#/components/responses/invalidYear',
                  },
                  yearIsNaD: { $ref: '#/components/responses/yearIsNaD' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/customerAccessOnly' },
          404: {
            $ref: '#/components/responses/transactionsByAccountInYearNotFound',
          },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/summary/monthly/{accountNumber}': {
      get: {
        tags: ['account'],
        summary:
          'Worker gets the monthly summary of transactions of an account ' +
          'in the current or informed year.',
        description:
          'The worker gets the monthly summary of the transactions of a customer ' +
          'account in the current or informed year.',
        parameters: [
          { $ref: '#/components/parameters/accountNumber' },
          { $ref: '#/components/parameters/year' },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/accountSummaryMonthly',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredParams: {
                    $ref: '#/components/responses/requiredParams',
                  },
                  requiredAccount: {
                    $ref: '#/components/responses/requiredAccount',
                  },
                  accountIsNaN: { $ref: '#/components/responses/accountIsNaN' },
                  accountLessMinimum: {
                    $ref: '#/components/responses/accountLessMinimum',
                  },
                  accountGreaterMaximum: {
                    $ref: '#/components/responses/accountGreaterMaximum',
                  },
                  invalidYear: {
                    $ref: '#/components/responses/invalidYear',
                  },
                  yearIsNaD: { $ref: '#/components/responses/yearIsNaD' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: {
            $ref: '#/components/responses/accountTransactionsInYearNotFound',
          },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/summary/yearly': {
      get: {
        tags: ['account'],
        summary:
          'Customer gets the annual summary of transactions ' +
          'in the current or informed year.',
        description:
          'The customer gets the annual summary of the transactions from ' +
          'his own account in the current or informed year.',
        parameters: [{ $ref: '#/components/parameters/year' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/accountSummaryYearly',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  invalidYear: {
                    $ref: '#/components/responses/invalidYear',
                  },
                  yearIsNaD: { $ref: '#/components/responses/yearIsNaD' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/customerAccessOnly' },
          404: {
            $ref: '#/components/responses/transactionsByAccountInYearNotFound',
          },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/summary/yearly/{accountNumber}': {
      get: {
        tags: ['account'],
        summary:
          'Worker gets the annual summary of transactions of an account ' +
          'in the current or informed year.',
        description:
          'The worker gets the annual summary of the transactions of a customer ' +
          'account in the current or informed year.',
        parameters: [
          { $ref: '#/components/parameters/accountNumber' },
          { $ref: '#/components/parameters/year' },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/accountSummaryYearly',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  requiredParams: {
                    $ref: '#/components/responses/requiredParams',
                  },
                  requiredAccount: {
                    $ref: '#/components/responses/requiredAccount',
                  },
                  accountIsNaN: { $ref: '#/components/responses/accountIsNaN' },
                  accountLessMinimum: {
                    $ref: '#/components/responses/accountLessMinimum',
                  },
                  accountGreaterMaximum: {
                    $ref: '#/components/responses/accountGreaterMaximum',
                  },
                  invalidYear: {
                    $ref: '#/components/responses/invalidYear',
                  },
                  yearIsNaD: { $ref: '#/components/responses/yearIsNaD' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: {
            $ref: '#/components/responses/accountTransactionsInYearNotFound',
          },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/list': {
      get: {
        tags: ['account'],
        summary: 'Worker gets the list of all bank accounts and balances.',
        description:
          'The worker gets the list of all bank accounts ' +
          'with their respective balance.',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/accountList' },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: { $ref: '#/components/responses/accountsNotFound' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/list/{accountCategory}': {
      get: {
        tags: ['account'],
        summary:
          'Worker gets the list of bank accounts and balances by category.',
        description:
          'The worker gets the list of bank accounts with their ' +
          'respective balance acording with the informed category.',
        parameters: [{ $ref: '#/components/parameters/accountCategory' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/accountList' },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: {
            description: 'Not Found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/accountList' },
                examples: {
                  PFaccountsNotFound: {
                    $ref: '#/components/responses/PFaccountsNotFound',
                  },
                  PJaccountsNotFound: {
                    $ref: '#/components/responses/PJaccountsNotFound',
                  },
                },
              },
            },
          },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/total/balance': {
      get: {
        tags: ['account'],
        summary: 'Worker gets the total balance of all accounts.',
        description: 'The worker gets the total balance of all bank accounts.',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/accountTotal' },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: { $ref: '#/components/responses/accountsNotFound' },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/total/balance/{accountCategory}': {
      get: {
        tags: ['account'],
        summary: 'Worker gets the total balance of accounts in a category.',
        description:
          'The worker gets the total balance of bank accounts in a category.',
        parameters: [{ $ref: '#/components/parameters/accountCategory' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/accountTotal' },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  PFaccountsNotFound: {
                    $ref: '#/components/responses/PFaccountsNotFound',
                  },
                  PJaccountsNotFound: {
                    $ref: '#/components/responses/PJaccountsNotFound',
                  },
                },
              },
            },
          },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/total/daily': {
      get: {
        tags: ['account'],
        summary:
          'Worker gets the daily total of transactions in all accounts ' +
          'in the current or informed period.',
        description:
          'The worker gets the daily total of transactions considering ' +
          'all bank accounts in the current or informed period.',
        parameters: [{ $ref: '#/components/parameters/period' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/accountTotalDaily',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  invalidPeriod: {
                    $ref: '#/components/responses/invalidPeriod',
                  },
                  periodIsNaD: { $ref: '#/components/responses/periodIsNaD' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: {
            description: 'Not Found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                example: {
                  error:
                    "Transactions not found in the month '2020-09' and " +
                    "category 'all'.",
                },
              },
            },
          },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/total/daily/{accountCategory}': {
      get: {
        tags: ['account'],
        summary:
          'Worker gets the daily total of transactions in a category of accounts ' +
          'in the current or informed period.',
        description:
          'The worker gets the daily total of transactions considering ' +
          'a categoy of bank accounts in the current or informed period.',
        parameters: [
          { $ref: '#/components/parameters/accountCategory' },
          { $ref: '#/components/parameters/period' },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/accountTotalDaily',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  invalidPeriod: {
                    $ref: '#/components/responses/invalidPeriod',
                  },
                  periodIsNaD: { $ref: '#/components/responses/periodIsNaD' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: {
            description: 'Not Found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  PFtransactionsNotFound: {
                    value: {
                      error:
                        "Transactions not found in the month '2020-09' and " +
                        "category 'PF'.",
                    },
                  },
                  PJtransactionsNotFound: {
                    value: {
                      error:
                        "Transactions not found in the month '2020-09' and " +
                        "category 'PJ'.",
                    },
                  },
                },
              },
            },
          },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/total/monthly': {
      get: {
        tags: ['account'],
        summary:
          'Worker gets the monthly total of transactions in all accounts ' +
          'in the current or informed period.',
        description:
          'The worker gets the monthly total of transactions considering ' +
          'all bank accounts in the current or informed period.',
        parameters: [{ $ref: '#/components/parameters/year' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/accountTotalMonthly',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  invalidYear: {
                    $ref: '#/components/responses/invalidYear',
                  },
                  yearIsNaD: { $ref: '#/components/responses/yearIsNaD' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: {
            $ref: '#/components/responses/accountTotalInYearNotFound',
          },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/total/monthly/{accountCategory}': {
      get: {
        tags: ['account'],
        summary:
          'Worker gets the monthly total of transactions in a category of accounts ' +
          'in the current or informed period.',
        description:
          'The worker gets the monthly total of transactions considering ' +
          'a categoy of bank accounts in the current or informed period.',
        parameters: [
          { $ref: '#/components/parameters/accountCategory' },
          { $ref: '#/components/parameters/year' },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/accountTotalMonthly',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  invalidYear: {
                    $ref: '#/components/responses/invalidYear',
                  },
                  yearIsNaD: { $ref: '#/components/responses/yearIsNaD' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: {
            $ref: '#/components/responses/accountTotalInYearByCategoryNotFound',
          },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/total/yearly': {
      get: {
        tags: ['account'],
        summary:
          'Worker gets the annual total of transactions in all accounts ' +
          'in the current or informed period.',
        description:
          'The worker gets the annual total of transactions considering ' +
          'all bank accounts in the current or informed period.',
        parameters: [{ $ref: '#/components/parameters/year' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/accountTotalYearly',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  invalidYear: {
                    $ref: '#/components/responses/invalidYear',
                  },
                  yearIsNaD: { $ref: '#/components/responses/yearIsNaD' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: {
            $ref: '#/components/responses/accountTotalInYearNotFound',
          },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    '/account/total/yearly/{accountCategory}': {
      get: {
        tags: ['account'],
        summary:
          'Worker gets the annual total of transactions in a category of accounts ' +
          'in the current or informed period.',
        description:
          'The worker gets the annual total of transactions considering ' +
          'a categoy of bank accounts in the current or informed period.',
        parameters: [
          { $ref: '#/components/parameters/accountCategory' },
          { $ref: '#/components/parameters/year' },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/accountTotalYearly',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/responseError' },
                examples: {
                  invalidYear: {
                    $ref: '#/components/responses/invalidYear',
                  },
                  yearIsNaD: { $ref: '#/components/responses/yearIsNaD' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authenticationError' },
          403: { $ref: '#/components/responses/workerAccessOnly' },
          404: {
            $ref: '#/components/responses/accountTotalInYearByCategoryNotFound',
          },
          500: { $ref: '#/components/responses/unexpectedError' },
        },
        security: [{ token: '' }],
      },
    },
    //#endregion
  },
  components: {
    requestBodies: {
      //#region request bodies fields
      name: {
        name: 'name',
        type: 'string',
        description: "User's full name.",
        example: 'João Silva',
      },
      CPForCNPJ: {
        name: 'CPForCNPJ',
        type: 'string',
        description:
          'Brazilian code for persons. CPF is the code for individuals ' +
          '(physical persons) and CNPJ is the code for legal entities ' +
          '(juridical persons). This code is unique for each person and is ' +
          'validated in our API. You can only inform numbers that the data ' +
          'will be saved and returned formatted.',
        example: '123.456.789-09',
      },
      email: {
        name: 'email',
        type: 'string',
        format: 'email',
        description: "User's email. This data is validated.",
        example: 'jsilva@mail.com',
      },
      mobilePhone: {
        name: 'mobilePhone',
        type: 'string',
        description:
          "User's cell phone number in Brazil. The phone is not required, " +
          'but if informed, it is validated according to Google rules.',
        example: '(11) 99999-8888',
      },
      fixedPhone: {
        name: 'fixedPhone',
        type: 'string',
        description:
          "User's landline number in Brazil. The phone is not required, " +
          'but if informed, it is validated according to Google rules.',
        example: '(11) 3333-4444',
      },
      password: {
        name: 'password',
        type: 'string',
        description: "User's password.",
        example: '12345',
        format: 'password',
      },
      file: {
        name: 'file',
        description: 'PDF file containing user documentation for upload.',
        type: 'string',
        format: 'binary',
      },
      tokenReset: {
        name: 'token',
        description: 'User reset password token.',
        type: 'string',
        example: 'ef48e2532f535a1822e0b5df376e9f4718acfa04ed00af59ae70ad33659d',
      },
      CPF: {
        name: 'CPF',
        type: 'string',
        description:
          'CPF is the Brazilian code for individuals (physical persons). ' +
          'This code is unique for each person and is validated in our API.',
        example: '123.456.789-09',
      },
      value: {
        name: 'value',
        type: 'number',
        description: 'The transaction amount.',
        minimum: 0.01,
        example: 0.01,
      },
      destinyAccount: {
        name: 'destinyAccount',
        type: 'integer',
        format: 'int32',
        description: 'The bank transfer destination account number.',
        example: 100000001,
      },
      //#endregion

      //#region request bodies schemas
      authRegister: {
        type: 'object',
        required: ['name', 'CPForCNPJ', 'email', 'password'],
        properties: {
          name: { $ref: '#/components/requestBodies/name' },
          CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
          email: { $ref: '#/components/requestBodies/email' },
          password: { $ref: '#/components/requestBodies/password' },
          mobilePhone: { $ref: '#/components/requestBodies/mobilePhone' },
          fixedPhone: { $ref: '#/components/requestBodies/fixedPhone' },
          file: { $ref: '#/components/requestBodies/file' },
        },
      },
      authAuthenticate: {
        type: 'object',
        required: ['CPForCNPJ', 'password'],
        properties: {
          CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
          password: { $ref: '#/components/requestBodies/password' },
        },
      },
      authResetPass: {
        type: 'object',
        required: ['CPForCNPJ', 'password', 'token'],
        properties: {
          CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
          password: { $ref: '#/components/requestBodies/password' },
          token: { $ref: '#/components/requestBodies/tokenReset' },
        },
      },
      userRegister: {
        type: 'object',
        required: ['email', 'mobilePhone', 'fixedPhone'],
        properties: {
          email: { $ref: '#/components/requestBodies/email' },
          mobilePhone: { $ref: '#/components/requestBodies/mobilePhone' },
          fixedPhone: { $ref: '#/components/requestBodies/fixedPhone' },
        },
      },
      userSetEmail: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { $ref: '#/components/requestBodies/email' },
        },
      },
      userSetMobile: {
        type: 'object',
        required: ['mobilePhone'],
        properties: {
          mobilePhone: { $ref: '#/components/requestBodies/mobilePhone' },
        },
      },
      userSetLandline: {
        type: 'object',
        required: ['fixedPhone'],
        properties: {
          fixedPhone: { $ref: '#/components/requestBodies/fixedPhone' },
        },
      },
      userSetFile: {
        type: 'object',
        required: ['file'],
        properties: {
          file: { $ref: '#/components/requestBodies/file' },
        },
      },
      accountTransfer: {
        type: 'object',
        required: ['value', 'destinyAccount'],
        properties: {
          value: { $ref: '#/components/requestBodies/value' },
          destinyAccount: { $ref: '#/components/requestBodies/destinyAccount' },
        },
      },
      requiredCPForCNPJ: {
        type: 'object',
        required: ['CPForCNPJ'],
        properties: {
          CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
        },
      },
      requiredCPF: {
        type: 'object',
        required: ['CPF'],
        properties: {
          CPF: { $ref: '#/components/requestBodies/CPF' },
        },
      },
      requiredValue: {
        type: 'object',
        required: ['value'],
        properties: {
          value: { $ref: '#/components/requestBodies/value' },
        },
      },
      //#endregion
    },
    parameters: {
      CPForCNPJ: {
        in: 'path',
        required: true,
        name: 'CPForCNPJ',
        schema: { $ref: '#/components/requestBodies/CPForCNPJ' },
        description: {
          $ref: '#/components/requestBodies/CPForCNPJ/description',
        },
      },
      userCategory: {
        in: 'path',
        required: true,
        name: 'userCategory',
        description:
          'Worker lists users according to their category: ' +
          'PF - Physical Persons, PJ - Juridical Persons, worker - Bank Employee, ' +
          'unchecked: Users with documentation submitted but not verified',
        schema: {
          type: 'string',
          enum: ['PF', 'PJ', 'worker', 'unchecked'],
        },
      },
      accountCategory: {
        in: 'path',
        required: true,
        name: 'accountCategory',
        description:
          'Worker filters accounts according to their category: ' +
          'PF - Physical Persons, PJ - Juridical Persons.',
        schema: {
          type: 'string',
          enum: ['PF', 'PJ'],
        },
      },
      accountNumber: {
        in: 'path',
        required: true,
        name: 'account',
        schema: { $ref: '#/components/responses/account' },
        description: {
          $ref: '#/components/responses/account/description',
        },
      },
      nameSnippet: {
        in: 'query',
        name: 'name',
        schema: { type: 'string' },
        description:
          'Filters users by name snippet without case-sensitive search.',
      },
      period: {
        in: 'query',
        name: 'period',
        schema: { $ref: '#/components/responses/period' },
        description: {
          $ref: '#/components/responses/period/description',
        },
      },
      year: {
        in: 'query',
        name: 'period',
        schema: { $ref: '#/components/responses/year' },
        description: {
          $ref: '#/components/responses/year/description',
        },
      },
    },
    securitySchemes: {
      token: {
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'JWT',
      },
    },
    responses: {
      //#region body response fields
      fileName: {
        name: 'fileName',
        description: 'User PDF file loaded, renamed and saved.',
        type: 'string',
        example: '12345678909_20200930211505163.pdf',
      },
      createdAt: {
        name: 'createdAt',
        description: 'Fulldate and time of creation in ISO format.',
        type: 'string',
        format: 'date-time',
        example: '2020-09-30T21:15:05.163Z',
      },
      tokenAuth: {
        name: 'token',
        description: 'User authentication token.',
        type: 'string',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Zjc0ZjU1OTllNTY5M' +
          'jBkMDQ3OGMxYzgiLCJDUEZvckNOUEoiOiIxMjMuNDU2Ljc4OS0wOSIsIndvcmtlciI' +
          '6ZmFsc2UsImN1c3RvbWVyIjpmYWxzZSwiaWF0IjoxNjAxNTAwNTA2LCJleHAiOjE2M' +
          'DE1ODY5MDZ9.nU8OQVPZknPcw8-810a0N8yLMc0XssCLKf3d5FNP20E',
      },
      workerTrue: {
        name: 'worker',
        description:
          'Indicates whether the user has bank employee access privilege.',
        type: 'boolean',
        example: true,
      },
      workerFalse: {
        name: 'worker',
        description: { $ref: '#/components/responses/workerTrue/description' },
        type: 'boolean',
        example: false,
      },
      alertMobilePhone: {
        name: 'mobilePhone',
        type: 'string',
        description:
          'Alerts the user that the landline has not been recorded ' +
          'because it is invalid.',
        example:
          "'1199998888' was not recorded because it is not a valid Brazilian " +
          'mobile phone number according to Google rules.',
      },
      alertFixedPhone: {
        name: 'fixedPhone',
        type: 'string',
        description:
          'Alerts the user that the landline has not been recorded ' +
          'because it is invalid.',
        example:
          "'11333334444' was not recorded because it is not a valid Brazilian " +
          'fixed phone number according to Google rules.',
      },
      alertFile: {
        name: 'file',
        type: 'string',
        description:
          'Alerts the user that the account is created ' +
          'after uploading the PDF file.',
        example:
          "You didn't upload the PDF file. The account is " +
          'created after sending and approving the documentation.',
      },
      account: {
        name: 'account',
        type: 'integer',
        format: 'int32',
        description: 'A bank account number.',
        example: 100000000,
      },
      balance: {
        name: 'balance',
        type: 'number',
        description: 'The balance available in a bank account.',
        example: 0,
      },
      customer: {
        name: 'customer',
        type: 'string',
        description: 'The CPF or CNPJ of a Brazilian customer.',
        example: '123.456.789-09',
      },
      customerName: {
        name: 'customerName',
        type: 'string',
        description: 'The full name of a Brazilian customer.',
        example: 'João Silva',
      },
      period: {
        name: 'period',
        type: 'string',
        description: "The year and month in 'yyyy-mm' format.",
        example: '2020-09',
      },
      date: {
        name: 'date',
        type: 'string',
        description: "A complete date in 'yyyy-mm-dd' format.",
        example: '2020-09-30',
      },
      year: {
        name: 'year',
        type: 'string',
        description: "A year in the format 'yyyy'.",
        example: '2020',
      },
      indicator: {
        name: 'indicator',
        type: 'string',
        description: 'The indicator of a transaction: D - Debit, C - Credit.',
      },
      description: {
        name: 'description',
        type: 'string',
        description: 'The description of a transaction.',
      },
      previousBalance: {
        name: 'previousBalance',
        type: 'number',
        description: 'The balance of the account before the transaction.',
        example: 1000,
      },
      currentBalance: {
        name: 'currentBalance',
        type: 'number',
        description: 'The balance of the account after the transaction.',
      },
      sourceAccount: {
        name: 'sourceAccount',
        type: 'integer',
        format: 'int32',
        description: 'The bank transfer source account number.',
        example: 100000000,
      },
      sourceCustomerName: {
        name: 'sourceCustomerName',
        type: 'string',
        description: 'The full name of the bank transfer originating customer.',
        example: 'João Silva',
      },
      destinyCustomerName: {
        name: 'destinyCustomerName',
        type: 'string',
        description: 'The full name of the bank transfer destination customer.',
        example: 'José da Silva',
      },
      sourcePreviousBalance: {
        name: 'sourcePreviousBalance',
        type: 'number',
        description: 'The balance of the source account before the transfer.',
        example: 1000,
      },
      sourceCurrentBalance: {
        name: 'sourceCurrentBalance',
        type: 'number',
        description: 'The balance of the source account after the transfer.',
        example: 999.99,
      },
      debitCurrentBalance: {
        name: 'currentBalance',
        type: 'number',
        description: {
          $ref: '#/components/responses/currentBalance/description',
        },
        example: 999.99,
      },
      debitIndicator: {
        name: 'indicator',
        type: 'string',
        description: { $ref: '#/components/responses/indicator/description' },
        example: 'D',
      },
      debitDescription: {
        name: 'description',
        type: 'string',
        description: { $ref: '#/components/responses/description/description' },
        example: 'DIRECT DEBIT',
      },
      creditCurrentBalance: {
        name: 'currentBalance',
        type: 'number',
        description: {
          $ref: '#/components/responses/currentBalance/description',
        },
        example: 1000.01,
      },
      creditIndicator: {
        name: 'indicator',
        type: 'string',
        description: { $ref: '#/components/responses/indicator/description' },
        example: 'C',
      },
      creditDescription: {
        name: 'description',
        type: 'string',
        description: { $ref: '#/components/responses/description/description' },
        example: 'DIRECT CREDIT',
      },
      totalTransactions: {
        name: 'totalTransactions',
        type: 'integer',
        format: 'int32',
        description: 'The total number of transactions.',
        example: 1,
      },
      initialBalance: {
        name: 'initialBalance',
        type: 'number',
        description: 'The opening balance amount.',
        example: 1000,
      },
      totalDebits: {
        name: 'totalDebits',
        type: 'number',
        description: 'The total amount of debits.',
        example: 0.01,
      },
      totalCredits: {
        name: 'totalCredits',
        type: 'number',
        description: 'The total amount of credits.',
        example: 0,
      },
      finalBalance: {
        name: 'finalBalance',
        type: 'number',
        description: 'The final balance amount.',
        example: 999.99,
      },
      totalAccounts: {
        name: 'totalAccounts',
        type: 'integer',
        format: 'int32',
        description: 'The total number of accounts.',
        example: 1,
      },
      totalBalance: {
        name: 'totalBalance',
        type: 'number',
        description: 'The total current balance available.',
        example: 1000,
      },
      totalDifference: {
        name: 'totalDifference',
        type: 'number',
        description:
          'The total amount of debits minus the total amount of credits.',
        example: 0.01,
      },
      //#endregion

      //#region response code 200
      success: {
        type: 'object',
        properties: {
          success: {
            type: 'string',
          },
        },
      },
      authRegister: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            description: "Returns the user's recorded data",
            properties: {
              name: { $ref: '#/components/requestBodies/name' },
              CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
              email: { $ref: '#/components/requestBodies/email' },
              mobilePhone: {
                $ref: '#/components/requestBodies/mobilePhone',
              },
              fixedPhone: { $ref: '#/components/requestBodies/fixedPhone' },
              fileName: { $ref: '#/components/responses/fileName' },
              createdAt: { $ref: '#/components/responses/createdAt' },
              token: { $ref: '#/components/responses/tokenAuth' },
            },
          },
          alert: {
            type: 'object',
            description: 'Alerts the user of unsaved or unsent data',
            properties: {
              mobilePhone: {
                $ref: '#/components/responses/alertMobilePhone',
              },
              fixedPhone: {
                $ref: '#/components/responses/alertFixedPhone',
              },
              file: { $ref: '#/components/responses/alertFile' },
            },
          },
        },
      },
      authAuthenticate: {
        type: 'object',
        properties: {
          name: { $ref: '#/components/requestBodies/name' },
          CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
          email: { $ref: '#/components/requestBodies/email' },
          token: { $ref: '#/components/responses/tokenAuth' },
        },
      },
      userDetails: {
        type: 'object',
        description: "Returns the user's details.",
        properties: {
          name: { $ref: '#/components/requestBodies/name' },
          CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
          email: { $ref: '#/components/requestBodies/email' },
          mobilePhone: { $ref: '#/components/requestBodies/mobilePhone' },
          fixedPhone: { $ref: '#/components/requestBodies/fixedPhone' },
          createdAt: { $ref: '#/components/responses/createdAt' },
        },
      },
      userList: {
        type: 'array',
        description: 'Returns a list of users.',
        items: {
          type: 'object',
          properties: {
            name: { $ref: '#/components/requestBodies/name' },
            CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
            email: { $ref: '#/components/requestBodies/email' },
          },
        },
      },
      userRegister: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            description: "Returns the user's updated data",
            properties: {
              name: { $ref: '#/components/requestBodies/name' },
              CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
              email: { $ref: '#/components/requestBodies/email' },
              mobilePhone: { $ref: '#/components/requestBodies/mobilePhone' },
              fixedPhone: { $ref: '#/components/requestBodies/fixedPhone' },
            },
          },
          alert: {
            type: 'object',
            description: 'Alerts the user of unsaved phones',
            properties: {
              mobilePhone: { $ref: '#/components/responses/alertMobilePhone' },
              fixedPhone: { $ref: '#/components/responses/alertFixedPhone' },
            },
          },
        },
      },
      userPatch: {
        type: 'object',
        properties: {
          name: { $ref: '#/components/requestBodies/name' },
          CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
          email: { $ref: '#/components/requestBodies/email' },
        },
      },
      userSetMobile: {
        type: 'object',
        properties: {
          name: { $ref: '#/components/requestBodies/name' },
          CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
          email: { $ref: '#/components/requestBodies/email' },
          mobilePhone: { $ref: '#/components/requestBodies/mobilePhone' },
        },
      },
      userSetLandline: {
        type: 'object',
        properties: {
          name: { $ref: '#/components/requestBodies/name' },
          CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
          email: { $ref: '#/components/requestBodies/email' },
          fixedPhone: { $ref: '#/components/requestBodies/fixedPhone' },
        },
      },
      userSetFile: {
        type: 'object',
        properties: {
          name: { $ref: '#/components/requestBodies/name' },
          CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
          email: { $ref: '#/components/requestBodies/email' },
          fileName: { $ref: '#/components/responses/fileName' },
        },
      },
      userSetWorker: {
        type: 'object',
        properties: {
          worker: { $ref: '#/components/responses/workerTrue' },
          name: { $ref: '#/components/requestBodies/name' },
          CPF: { $ref: '#/components/requestBodies/CPF' },
          email: { $ref: '#/components/requestBodies/email' },
        },
      },
      userUnsetWorker: {
        type: 'object',
        properties: {
          worker: { $ref: '#/components/responses/workerFalse' },
          name: { $ref: '#/components/requestBodies/name' },
          CPF: { $ref: '#/components/requestBodies/CPF' },
          email: { $ref: '#/components/requestBodies/email' },
        },
      },
      accountRegister: {
        type: 'object',
        properties: {
          balance: { $ref: '#/components/responses/balance' },
          customer: { $ref: '#/components/responses/customer' },
          createdAt: { $ref: '#/components/responses/createdAt' },
          account: { $ref: '#/components/responses/account' },
          customerName: { $ref: '#/components/responses/customerName' },
        },
      },
      accountTransfer: {
        type: 'object',
        properties: {
          sourceAccount: { $ref: '#/components/responses/sourceAccount' },
          sourceCustomerName: {
            $ref: '#/components/responses/sourceCustomerName',
          },
          destinyAccount: { $ref: '#/components/requestBodies/destinyAccount' },
          destinyCustomerName: {
            $ref: '#/components/responses/destinyCustomerName',
          },
          period: { $ref: '#/components/responses/period' },
          createdAt: { $ref: '#/components/responses/createdAt' },
          value: { $ref: '#/components/requestBodies/value' },
          sourcePreviousBalance: {
            $ref: '#/components/responses/sourcePreviousBalance',
          },
          sourceCurrentBalance: {
            $ref: '#/components/responses/sourceCurrentBalance',
          },
        },
      },
      accountDebit: {
        type: 'object',
        properties: {
          value: { $ref: '#/components/requestBodies/value' },
          previousBalance: {
            $ref: '#/components/responses/previousBalance',
          },
          currentBalance: {
            $ref: '#/components/responses/debitCurrentBalance',
          },
          period: { $ref: '#/components/responses/period' },
          createdAt: { $ref: '#/components/responses/createdAt' },
          description: { $ref: '#/components/responses/debitDescription' },
          indicator: { $ref: '#/components/responses/debitIndicator' },
          account: { $ref: '#/components/responses/account' },
          customerName: { $ref: '#/components/responses/customerName' },
        },
      },
      accountCredit: {
        type: 'object',
        properties: {
          value: { $ref: '#/components/requestBodies/value' },
          previousBalance: {
            $ref: '#/components/responses/previousBalance',
          },
          currentBalance: {
            $ref: '#/components/responses/creditCurrentBalance',
          },
          period: { $ref: '#/components/responses/period' },
          createdAt: { $ref: '#/components/responses/createdAt' },
          description: { $ref: '#/components/responses/creditDescription' },
          indicator: { $ref: '#/components/responses/creditIndicator' },
          account: { $ref: '#/components/responses/account' },
          customerName: { $ref: '#/components/responses/customerName' },
        },
      },
      accountBalance: {
        type: 'object',
        properties: {
          balance: { $ref: '#/components/responses/balance' },
          customer: { $ref: '#/components/responses/customer' },
          account: { $ref: '#/components/responses/account' },
          customerName: { $ref: '#/components/responses/customerName' },
        },
      },
      customerBalance: {
        type: 'object',
        properties: {
          balance: { $ref: '#/components/responses/balance' },
          account: { $ref: '#/components/responses/account' },
          customerName: { $ref: '#/components/responses/customerName' },
        },
      },
      accountDetails: {
        type: 'array',
        description: 'Returns the transactions of an account.',
        items: { $ref: '#/components/responses/accountDebit' },
      },
      accountSummaryDaily: {
        type: 'array',
        description: 'Returns the daily summary of transactions in an account.',
        items: {
          type: 'object',
          properties: {
            totalTransactions: {
              $ref: '#/components/responses/totalTransactions',
            },
            initialBalance: { $ref: '#/components/responses/initialBalance' },
            totalDebits: { $ref: '#/components/responses/totalDebits' },
            totalCredits: { $ref: '#/components/responses/totalCredits' },
            finalBalance: { $ref: '#/components/responses/finalBalance' },
            date: { $ref: '#/components/responses/date' },
          },
        },
      },
      accountSummaryMonthly: {
        type: 'array',
        description:
          'Returns the monthly summary of transactions in an account.',
        items: {
          type: 'object',
          properties: {
            totalTransactions: {
              $ref: '#/components/responses/totalTransactions',
            },
            initialBalance: { $ref: '#/components/responses/initialBalance' },
            totalDebits: { $ref: '#/components/responses/totalDebits' },
            totalCredits: { $ref: '#/components/responses/totalCredits' },
            finalBalance: { $ref: '#/components/responses/finalBalance' },
            period: { $ref: '#/components/responses/period' },
          },
        },
      },
      accountSummaryYearly: {
        type: 'array',
        description:
          'Returns the yearly summary of transactions in an account.',
        items: {
          type: 'object',
          properties: {
            totalTransactions: {
              $ref: '#/components/responses/totalTransactions',
            },
            initialBalance: { $ref: '#/components/responses/initialBalance' },
            totalDebits: { $ref: '#/components/responses/totalDebits' },
            totalCredits: { $ref: '#/components/responses/totalCredits' },
            finalBalance: { $ref: '#/components/responses/finalBalance' },
            year: { $ref: '#/components/responses/year' },
          },
        },
      },
      accountList: {
        type: 'array',
        description: 'Lists bank accounts and their balances.',
        items: {
          type: 'object',
          properties: {
            balance: { $ref: '#/components/responses/balance' },
            account: { $ref: '#/components/responses/account' },
          },
        },
      },
      accountTotalBalance: {
        type: 'array',
        description: 'Returns the current balance available in bank accounts.',
        items: {
          type: 'object',
          properties: {
            totalAccounts: { $ref: '#/components/responses/totalAccounts' },
            totalBalance: { $ref: '#/components/responses/totalBalance' },
          },
        },
      },
      accountTotalDaily: {
        type: 'array',
        description:
          'Returns the daily total of bank transactions' +
          'according to the parameters informed.',
        items: {
          type: 'object',
          properties: {
            totalTransactions: {
              $ref: '#/components/responses/totalTransactions',
            },
            totalDebits: { $ref: '#/components/responses/totalDebits' },
            totalCredits: { $ref: '#/components/responses/totalCredits' },
            totalDifference: { $ref: '#/components/responses/totalDifference' },
            date: { $ref: '#/components/responses/date' },
          },
        },
      },
      accountTotalMonthly: {
        type: 'array',
        description:
          'Returns the monthly total of bank transactions' +
          'according to the parameters informed.',
        items: {
          type: 'object',
          properties: {
            totalTransactions: {
              $ref: '#/components/responses/totalTransactions',
            },
            totalDebits: { $ref: '#/components/responses/totalDebits' },
            totalCredits: { $ref: '#/components/responses/totalCredits' },
            totalDifference: { $ref: '#/components/responses/totalDifference' },
            period: { $ref: '#/components/responses/period' },
          },
        },
      },
      accountTotalYearly: {
        type: 'array',
        description:
          'Returns the annual total of bank transactions' +
          'according to the parameters informed.',
        items: {
          type: 'object',
          properties: {
            totalTransactions: {
              $ref: '#/components/responses/totalTransactions',
            },
            totalDebits: { $ref: '#/components/responses/totalDebits' },
            totalCredits: { $ref: '#/components/responses/totalCredits' },
            totalDifference: { $ref: '#/components/responses/totalDifference' },
            year: { $ref: '#/components/responses/year' },
          },
        },
      },
      //#endregion

      //#region response error
      responseError: {
        type: 'object',
        properties: {
          error: {
            description: 'The error message',
            example: 'An error has occurred',
            type: 'string',
          },
        },
      },
      //#endregion

      //#region responses code 400
      requiredBody: {
        value: {
          error: 'The request body must have fields informed.',
        },
      },
      requiredParams: {
        value: {
          error: 'The request parameters must have fields informed.',
        },
      },
      requiredCPForCNPJ: {
        value: {
          error:
            "The field 'CPForCNPJ' is required in this request " +
            'but has been omitted.',
        },
      },
      requiredCPF: {
        value: {
          error:
            "The field 'CPF' is required in this request but has been omitted.",
        },
      },
      requiredValue: {
        value: {
          error:
            "The field 'value' is required in this request " +
            'but has been omitted.',
        },
      },
      requiredAccount: {
        value: {
          error:
            "The field 'account' is required in this request " +
            'but has been omitted.',
        },
      },
      invalidCPForCNPJ: {
        value: {
          error: "'123.456.789' is not a valid CPF or CNPJ.",
        },
      },
      invalidCPF: {
        value: {
          error: "'123.456.789' is not a valid CPF.",
        },
      },
      invalidEmail: {
        value: {
          error: "'mail.email.com' is not a valid email.",
        },
      },
      invalidPDF: {
        value: {
          error: "The file 'example.doc' is not in PDF format.",
        },
      },
      invalidTransaction: {
        value: {
          error:
            "Transaction invalid. The available balance is '900' and " +
            "it is not enough for the amount of this request, '1000'.",
        },
      },
      invalidPeriod: {
        value: {
          error:
            "The value '202009' in the 'period' field is invalid. " +
            "Use the format 'yyyy-mm'.",
        },
      },
      periodIsNaD: {
        value: {
          error:
            "The 'period' field with value '2020-13' is not valid. " +
            "Use the format 'yyyy-mm'.",
        },
      },
      invalidYear: {
        value: {
          error:
            "The value '202' in the 'period' field is invalid. " +
            "Use the format 'yyyy'.",
        },
      },
      yearIsNaD: {
        value: {
          error:
            "The 'period' field with value '20-1' is not valid. " +
            "Use the format 'yyyy'.",
        },
      },
      valueIsNaN: {
        value: {
          error: "The value must be a number, but 'abc' is not.",
        },
      },
      valueLessMinimum: {
        value: {
          error:
            "The value must be equal or greater than '0.01', but '0' is not.",
        },
      },
      accountIsNaN: {
        value: {
          error: "The account must be a number, but 'abcdefghi' is not.",
        },
      },
      accountLessMinimum: {
        value: {
          error:
            "The account must be equal or greater than '100000000', " +
            "but '99999999' is not.",
        },
      },
      accountGreaterMaximum: {
        value: {
          error:
            "The account must be equal or less than '999999999', " +
            "but '1000000000' is not.",
        },
      },
      //#endregion

      //#region response code 401
      authenticationError: {
        description: 'Unautorized',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/responseError' },
            examples: {
              requiredToken: {
                value: {
                  error: 'No token provided.',
                },
              },
              invalidTokenParts: {
                value: {
                  error: 'Token does not have two parts.',
                },
              },
              invalidTokenPrefix: {
                value: {
                  error: 'Malformed token, the prefix is ​​invalid.',
                },
              },
              rejectedToken: {
                value: {
                  error: 'Token invalid, jwt expired.',
                },
              },
              replacedToken: {
                value: {
                  error:
                    'The provided token has been replaced and discontinued.',
                },
              },
            },
          },
        },
      },
      //#endregion

      //#region responses code 403
      customerAccessOnly: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/responseError' },
            example: {
              error:
                'This content can only be accessed by customers of this bank. ' +
                'Open your account.',
            },
          },
        },
      },
      userAccessOnly: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/responseError' },
            example: {
              error:
                'This content can only be accessed by users without an ' +
                'account at this bank. This change is carried out by our ' +
                'support team through a ticket.',
            },
          },
        },
      },
      workerAccessOnly: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/responseError' },
            example: {
              error:
                'This content can only be accessed by employees of this bank.',
            },
          },
        },
      },
      //#endregion

      //#region responses code 404
      userNotFound: {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/responseError' },
            example: {
              error: "User with CPF '123.456.789-09' not found.",
            },
          },
        },
      },
      accountNotFound: {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/responseError' },
            example: {
              error: "Account '100000001' not found.",
            },
          },
        },
      },
      accountsNotFound: {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/responseError' },
            example: {
              error: 'Accounts not found.',
            },
          },
        },
      },
      PFaccountsNotFound: {
        value: {
          error: 'Physical person accounts not found.',
        },
      },
      PJaccountsNotFound: {
        value: {
          error: 'Legal person accounts not found.',
        },
      },
      transactionsByAccountInMonthNotFound: {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/responseError' },
            example: {
              error:
                "Transactions not found in the month '2020-09' and account '100000001'.",
            },
          },
        },
      },
      transactionsByAccountInYearNotFound: {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/responseError' },
            example: {
              error:
                "Transactions not found in the year '2020' and account '100000001'.",
            },
          },
        },
      },
      accountTransactionsInMonthNotFound: {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/responseError' },
            examples: {
              accountNotFound: {
                value: {
                  error: "Account '100000001' not found.",
                },
              },
              transactionsNotFound: {
                value: {
                  error:
                    "Transactions not found in the month '2020-09' and account '100000001'.",
                },
              },
            },
          },
        },
      },
      accountTransactionsInYearNotFound: {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/responseError' },
            examples: {
              accountNotFound: {
                value: {
                  error: "Account '100000001' not found.",
                },
              },
              transactionsNotFound: {
                value: {
                  error:
                    "Transactions not found in the year '2020' and account '100000001'.",
                },
              },
            },
          },
        },
      },
      accountTotalInYearNotFound: {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/responseError' },
            example: {
              error:
                "Transactions not found in the year '2020' and category 'all'.",
            },
          },
        },
      },
      accountTotalInYearByCategoryNotFound: {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/responseError' },
            examples: {
              PFaccountTotalInYearNotFound: {
                value: {
                  error:
                    "Transactions not found in the year '2020' and category 'PF'.",
                },
              },
              PJaccountTotalInYearNotFound: {
                value: {
                  error:
                    "Transactions not found in the year '2020' and category 'PJ'.",
                },
              },
            },
          },
        },
      },
      //#endregion

      //#region response code 500
      unexpectedError: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/responseError' },
            example: { error: 'An unexpected error has occurred.' },
          },
        },
      },
      //#endregion
    },
  },
};
