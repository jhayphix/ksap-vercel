POST http://localhost:5000/api/applications
Zod validation errors: [
  {
    code: 'invalid_type',
    expected: 'string',
    received: 'undefined',
    path: [ 'applicantId' ],
    message: 'Required'
  },
  {
    code: 'invalid_type',
    expected: 'array',
    received: 'undefined',
    path: [ 'responseSections' ],
    message: 'Required'
  },
  {
    code: 'invalid_type',
    expected: 'string',
    received: 'undefined',
    path: [ 'scholarshipId' ],
    message: 'Required'
  },
  {
    code: 'invalid_type',
    expected: 'string',
    received: 'undefined',
    path: [ 'externalId' ],
    message: 'Required'
  }
]