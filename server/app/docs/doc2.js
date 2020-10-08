export const swaggerDoc = {
  swagger: '2.0',
  info: {
    title: 'LIVE-BAAS - Bank As A Service',
    description: 'This is a sample and fictitious Bank API.',
    version: '1.0.0',
    contact: {
      email: 'marcelorispoli@gmail.com',
    },
  },
  host: process.env.HOST,
  basePath: '/',
  tags: [
    {
      name: 'auth',
      description:
        'The user creates his registration, performs his authentication, ' +
        'informs that forgot his password and resets it.',
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
  parameters: {
    name: {
      name: 'name',
      type: 'string',
      description: `User's full name.`,
      example: 'João Silva',
    },
    CPForCNPJ: {
      name: 'CPForCNPJ',
      type: 'string',
      description:
        `Brazilian code for persons. CPF is the code for individuals (physical ` +
        `persons) and CNPJ is the code for legal entities (juridical persons). ` +
        `This code is unique for each person and is validated in our API. ` +
        `You can only inform numbers that the data will be saved and returned formatted.`,
      example: '123.456.789-09',
    },
    email: {
      name: 'email',
      type: 'string',
      description: `User's email. This data is validated.`,
      example: 'jsilva@mail.com',
    },
    mobilePhone: {
      name: 'mobilePhone',
      type: 'string',
      description:
        `User's cell phone number in Brazil. The phone is not required, ` +
        `but if informed, it is validated according to Google rules.`,
      example: '(11) 99999-8888',
    },
    fixedPhone: {
      name: 'fixedPhone',
      type: 'string',
      description:
        `User's landline number in Brazil. The phone is not required, ` +
        `but if informed, it is validated according to Google rules.`,
      example: '(11) 3333-4444',
    },
    password: {
      name: 'password',
      description: `User's password.`,
      type: 'string',
      example: '12345',
      format: 'password',
    },
    file: {
      name: 'file',
      description: 'PDF file containing user documentation for upload.',
      type: 'file',
    },
    fileName: {
      name: 'fileName',
      description: 'User PDF file loaded, renamed and saved.',
      type: 'string',
      example: '12345678909_20200930211505163.pdf',
    },
    tokenAuth: {
      name: 'token',
      description: 'User authentication token.',
      type: 'string',
      example:
        `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Zjc0ZjU1OTllNTY5Mj` +
        `BkMDQ3OGMxYzgiLCJDUEZvckNOUEoiOiIxMjMuNDU2Ljc4OS0wOSIsIndvcmtlciI6Z` +
        `mFsc2UsImN1c3RvbWVyIjpmYWxzZSwiaWF0IjoxNjAxNTAwNTA2LCJleHAiOjE2MDE1` +
        `ODY5MDZ9.nU8OQVPZknPcw8-810a0N8yLMc0XssCLKf3d5FNP20E`,
    },
    tokenReset: {
      name: 'token',
      description: 'User reset password token.',
      type: 'string',
    },
    createdAt: {
      name: 'createdAt',
      description: 'Fulldate and time of creation in ISO format.',
      type: 'string',
      format: 'date-time',
      example: '2020-09-30T21:15:05.163Z',
    },
    alertMobilePhone: {
      name: 'mobilePhone',
      type: 'string',
      description:
        `Alerts the user that the landline has not been recorded ` +
        `because it is invalid.`,
      example:
        `'1199998888' was not recorded because it is not a valid Brazilian ` +
        `mobile phone number according to Google rules.`,
    },
    alertFixedPhone: {
      name: 'fixedPhone',
      type: 'string',
      description:
        `Alerts the user that the landline has not been recorded ` +
        `because it is invalid.`,
      example:
        `'11333334444' was not recorded because it is not a valid Brazilian ` +
        `fixed phone number according to Google rules.`,
    },
    alertFile: {
      name: 'file',
      type: 'string',
      description:
        `Alerts the user that the account is created ` +
        `after uploading the PDF file.`,
      example:
        `You didn't upload the PDF file. The account is ` +
        `created after sending and approving the documentation.`,
    },
    errorRequiredBody: {
      name: 'error',
      type: 'string',
      description:
        'Error returned when the request body is mandatory and was not reported.',
      example: 'The request body must have fields informed.',
    },
    errorRequiredFields: {
      name: 'error',
      type: 'string',
      description:
        'Error returned when any mandatory field in the request body is omitted.',
      example: `The field value is required in this request, but is been omitted.`,
    },
    errorRequiredPDF: {},
    errorRequiredZeroBalance: {},
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['auth'],
        summary: 'User creation',
        description: 'User self registration',
        consumes: ['multipart/form-data'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'formData',
            required: true,
            name: { $ref: '#/parameters/name/name' },
            type: { $ref: '#/parameters/name/type' },
            description: { $ref: '#/parameters/name/description' },
            example: { $ref: '#/parameters/name/example' },
          },
          {
            in: 'formData',
            required: true,
            name: { $ref: '#/parameters/CPForCNPJ/name' },
            type: { $ref: '#/parameters/CPForCNPJ/type' },
            description: { $ref: '#/parameters/CPForCNPJ/description' },
            example: { $ref: '#/parameters/CPForCNPJ/example' },
          },
          {
            in: 'formData',
            required: true,
            name: { $ref: '#/parameters/email/name' },
            type: { $ref: '#/parameters/email/type' },
            description: { $ref: '#/parameters/email/description' },
            example: { $ref: '#/parameters/email/example' },
          },
          {
            in: 'formData',
            required: true,
            name: { $ref: '#/parameters/password/name' },
            type: { $ref: '#/parameters/password/type' },
            description: { $ref: '#/parameters/password/description' },
            example: { $ref: '#/parameters/password/example' },
            format: { $ref: '#/parameters/password/format' },
          },
          {
            in: 'formData',
            required: false,
            name: { $ref: '#/parameters/mobilePhone/name' },
            type: { $ref: '#/parameters/mobilePhone/type' },
            description: { $ref: '#/parameters/mobilePhone/description' },
            example: { $ref: '#/parameters/mobilePhone/example' },
          },
          {
            in: 'formData',
            required: false,
            name: { $ref: '#/parameters/fixedPhone/name' },
            type: { $ref: '#/parameters/fixedPhone/type' },
            description: { $ref: '#/parameters/fixedPhone/description' },
            example: { $ref: '#/parameters/fixedPhone/example' },
          },
          {
            in: 'formData',
            required: false,
            name: { $ref: '#/parameters/file/name' },
            type: { $ref: '#/parameters/file/type' },
            description: { $ref: '#/parameters/file/description' },
          },
        ],
        responses: {
          200: {
            schema: { $ref: '#/definitions/AuthRegisterResponse200' },
          },
          400: {
            description: 'An validation error has occurred.',
            name: 'error',
            type: 'string',
            schema: { $ref: '#definitions/InvalidCPForCNPJ' },
            //{
            // example:
            //      InvalidCPForCNPJ: {
            // `'123456789' is not a valid CPF or CNPJ.`,
            //      },
            //  },

            // examples: {
            //   InvalidCPForCNPJ: {
            //     value: { $ref: '#/definitions/InvalidCPForCNPJ' },
            //   },
            // },

            //  },
          },
          500: {
            description: 'An unexpected error has occurred.',
            name: 'error',
            //description: 'The error message',
            type: 'string',
          },
        },
      },
    },
    '/auth/authenticate': {
      post: {
        tags: ['auth'],
        summary: 'User authentication',
        description: 'User authenticates and gets the API usage token.',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            required: true,
            schema: {
              $ref: '#/definitions/AuthAuthenticateRequest',
            },
          },
        ],
        responses: {
          200: {
            description: 'Data returned.',
            type: 'object',
            properties: {
              name: {
                schema: {
                  $ref: '#/parameters/name',
                },
              },
              CPForCNPJ: {
                schema: {
                  $ref: '#/parameters/CPForCNPJ',
                },
              },
              email: {
                schema: {
                  $ref: '#/parameters/email',
                },
              },
              token: {
                schema: {
                  $ref: '#/parameters/tokenAuth',
                },
              },
            },
          },
          500: {
            description: 'An unexpected error has occurred',
            type: 'object',
            properties: {
              error: {
                name: 'error',
                description: 'The error message',
                type: 'string',
              },
            },
          },
        },
      },
    },
    '/auth/forgot_pass': {
      post: {
        tags: ['auth'],
        summary: 'User forgot password',
        description:
          `User informs that he forgot the password to receive ` +
          `email containing the password reset token.`,
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            schema: {
              $ref: '#/parameters/CPForCNPJ',
            },
            required: true,
          },
        ],
        responses: {
          200: {
            description: 'A success message is returned',
            type: 'object',
            properties: {
              success: {
                type: 'string',
                example: 'Forgot password email sended.',
              },
            },
          },
          500: {
            description: 'An unexpected error has occurred',
            type: 'object',
            properties: {
              error: {
                name: 'error',
                description: 'The error message',
                type: 'string',
              },
            },
          },
        },
      },
    },
    '/auth/reset_pass': {
      post: {
        tags: ['auth'],
        summary: 'User reset password',
        description:
          `User informs his CPF or CNPJ, the password reset token ` +
          `received by email and the new access password.`,
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            schema: {
              $ref: '#/parameters/CPForCNPJ',
            },
            required: true,
          },
          {
            in: 'body',
            schema: {
              $ref: '#/parameters/password',
            },
            required: true,
          },
          {
            in: 'body',
            schema: {
              $ref: '#/parameters/tokenReset',
            },
            required: true,
          },
        ],
        responses: {
          200: {
            description: 'A success message is returned',
            type: 'object',
            properties: {
              success: {
                type: 'string',
                example: 'Password redefined.',
              },
            },
          },
          500: {
            description: 'An unexpected error has occurred',
            type: 'object',
            properties: {
              error: {
                name: 'error',
                description: 'The error message',
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
  definitions: {
    AuthRegisterResponse200: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          description: `Returns the user's recorded data`,
          properties: {
            name: {
              $ref: '#/parameters/name',
            },
            CPForCNPJ: {
              $ref: '#/parameters/CPForCNPJ',
            },
            email: {
              $ref: '#/parameters/email',
            },
            mobilePhone: {
              $ref: '#/parameters/mobilePhone',
            },
            fixedPhone: {
              $ref: '#/parameters/fixedPhone',
            },
            fileName: {
              $ref: '#/parameters/fileName',
            },
            createdAt: {
              $ref: '#/parameters/createdAt',
            },
            token: {
              $ref: '#/parameters/tokenAuth',
            },
          },
        },
        alert: {
          type: 'object',
          description: 'Alerts the user of unsaved or unsent data',
          properties: {
            mobilePhone: {
              $ref: '#/parameters/alertMobilePhone',
            },
            fixedPhone: {
              $ref: '#/parameters/alertFixedPhone',
            },
            file: {
              $ref: '#/parameters/alertFile',
            },
          },
        },
      },
    },
    AuthRegisterResponse400: {
      type: 'object',
      properties: {
        error: {
          type: 'string',
        },
      },
      examples: {
        requiredBody: {
          error: `The request body must have fields informed.`,
        },
      },
    },
    //          example: `The request body must have fields informed.`,
    //        },
    //        error: {
    //          name: 'error',
    //          type: 'string',
    //          example:
    //            `The fields 'name', 'CPForCNPJ', 'email', 'password' are required ` +
    //            `in this request, but the field 'email' is been omitted.`,

    // {
    //   enum: [
    //     `The request body must have fields informed.`,
    //     `The fields 'name', 'CPForCNPJ', 'email', 'password' are required ` +
    //       `in this request, but the field 'email' is been omitted.`,
    //     `'111.111.111-11' is not a valid CPF or CNPJ.`,
    //     `'mail.email.com' is not a valid email.`,
    //     `User with CPF '123.456.789-09' already registered.`,
    //   ],
    //        },
    //      },
    //    },
    AuthAuthenticateRequest: {
      type: 'object',
      required: ['CPForCNPJ', 'password'],
      properties: {
        CPForCNPJ: {
          $ref: '#/parameters/CPForCNPJ',
        },
        password: {
          $ref: '#/parameters/password',
        },
      },
    },
    Error400: {
      type: 'object',
      description: 'Validation Error',
      properties: {
        error: {
          name: 'error',
          type: 'string',
          description: 'The message error',
        },
      },
      // examples: {
      //   InvalidCPForCNPJ: {
      //     value: { error: `'123456789' is not a valid CPF or CNPJ.` },
      //   },
      // },
    },
    InvalidCPForCNPJ: {
      type: 'object',
      properties: {
        error: {
          name: 'error',
          type: 'string',
          description: 'The message error',
          example: `'123456789' is not a valid CPF or CNPJ.`,
        },
      },
    },
  },
};
