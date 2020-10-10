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
        summary: 'Workers gets a list of all users with a name filter.',
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
                  requiredField: {
                    value: {
                      error:
                        "The field 'CPF' is required in this request, " +
                        'but has been omitted.',
                    },
                  },
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
    '/user/setWorker/Revoke': {
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
                  requiredField: {
                    value: {
                      error:
                        "The field 'CPF' is required in this request, " +
                        'but has been omitted.',
                    },
                  },
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
      requiredCPForCNPJ: {
        type: 'object',
        required: ['CPForCNPJ'],
        properties: {
          CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
        },
      },
      requiredCPF: {
        type: 'object',
        required: ['CPForCNPJ'],
        properties: {
          CPF: { $ref: '#/components/requestBodies/CPF' },
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
      nameSnippet: {
        in: 'query',
        required: false,
        name: 'name',
        schema: { type: 'string' },
        description:
          'Filters users by name snippet without case-sensitive search.',
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
        description:
          'Indicates whether the user has bank employee access privilege.',
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
              mobilePhone: { $ref: '#/components/requestBodies/mobilePhone' },
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
              mobilePhone: { $ref: '#/components/responses/alertMobilePhone' },
              fixedPhone: { $ref: '#/components/responses/alertFixedPhone' },
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
          CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
          email: { $ref: '#/components/requestBodies/email' },
        },
      },
      userUnsetWorker: {
        type: 'object',
        properties: {
          worker: { $ref: '#/components/responses/workerFalse' },
          name: { $ref: '#/components/requestBodies/name' },
          CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
          email: { $ref: '#/components/requestBodies/email' },
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
      // customerAccessOnly: {
      //   description: 'Forbidden',
      //   content: {
      //     'application/json': {
      //       schema: { $ref: '#/components/responses/responseError' },
      //       example: {
      //         error:
      //           'This content can only be accessed by employees of this bank.',
      //       },
      //     },
      //   },
      // },
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
