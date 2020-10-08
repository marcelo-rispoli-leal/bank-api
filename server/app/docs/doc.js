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
              schema: { $ref: '#/components/schemas/AuthRegisterRequest' },
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
                  $ref: '#/components/responses/AuthRegisterResponse200',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/ResponseError' },
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
              schema: { $ref: '#/components/schemas/AuthAuthenticateRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/AuthAuthenticateResponse200',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/ResponseError' },
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
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RequestCPForCNPJ' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/ResponseSuccess' },
                example: { success: 'Forgot password email sended.' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/ResponseError' },
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
              schema: { $ref: '#/components/schemas/AuthResetPassRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/ResponseSuccess' },
                example: { success: 'Password redefined.' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/ResponseError' },
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
                  $ref: '#/components/responses/UserDetailsResponse200',
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
                  $ref: '#/components/responses/UserDetailsResponse200',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/ResponseError' },
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
                  $ref: '#/components/responses/UsersList',
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
                schema: { $ref: '#/components/responses/ResponseError' },
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
  },
  components: {
    requestBodies: {
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
        type: 'string',
        description:
          'Filters users by name snippet without case-sensitive search.',
      },
    },
    schemas: {
      AuthRegisterRequest: {
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
      AuthAuthenticateRequest: {
        type: 'object',
        required: ['CPForCNPJ', 'password'],
        properties: {
          CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
          password: { $ref: '#/components/requestBodies/password' },
        },
      },
      AuthResetPassRequest: {
        type: 'object',
        required: ['CPForCNPJ', 'password', 'token'],
        properties: {
          CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
          password: { $ref: '#/components/requestBodies/password' },
          token: { $ref: '#/components/requestBodies/tokenReset' },
        },
      },
      RequestCPForCNPJ: {
        type: 'object',
        required: ['CPForCNPJ'],
        properties: {
          CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
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

      AuthRegisterResponse200: {
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
      AuthAuthenticateResponse200: {
        type: 'object',
        properties: {
          name: { $ref: '#/components/requestBodies/name' },
          CPForCNPJ: { $ref: '#/components/requestBodies/CPForCNPJ' },
          email: { $ref: '#/components/requestBodies/email' },
          token: { $ref: '#/components/responses/tokenAuth' },
        },
      },
      UserDetailsResponse200: {
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
      UsersList: {
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
      ResponseSuccess: {
        type: 'object',
        properties: {
          success: {
            type: 'string',
          },
        },
      },
      ResponseError: {
        type: 'object',
        properties: {
          error: {
            description: 'The error message',
            example: 'An error has occurred',
            type: 'string',
          },
        },
      },
      //#region reponses code 400
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
            schema: { $ref: '#/components/responses/ResponseError' },
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
      //       schema: { $ref: '#/components/responses/ResponseError' },
      //       example: {
      //         error:
      //           'This content can only be accessed by employees of this bank.',
      //       },
      //     },
      //   },
      // },
      // userAccessOnly: {
      //   description: 'Forbidden',
      //   content: {
      //     'application/json': {
      //       schema: { $ref: '#/components/responses/ResponseError' },
      //       example: {
      //         error:
      //           'This content can only be accessed by employees of this bank.',
      //       },
      //     },
      //   },
      // },
      workerAccessOnly: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/ResponseError' },
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
            schema: { $ref: '#/components/responses/ResponseError' },
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
            schema: { $ref: '#/components/responses/ResponseError' },
            example: { error: 'An unexpected error has occurred.' },
          },
        },
      },
      //#endregion
    },
  },
};
