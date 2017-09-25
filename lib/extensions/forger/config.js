module.exports = {
  forgeCommonExtensions: [
    {
      name: 'keyUsage',
      critical: true,
      digitalSignature: true,
      keyEncipherment: true
    },
    {
      name: 'basicConstraints',
      critical: false,
      cA: false
    },
    {
      name: 'extKeyUsage',
      serverAuth: true,
      clientAuth: true
    }
  ],
  commonExtensions: [
    {
      name: 'subjectKeyIdentifier'
    },
    {
      name: 'authorityKeyIdentifier',
      keyIdentifier: true
    }
  ],
  size: 2048,
  attributes: [
    {
      value: 'aniwei.studio',
      shortName: 'OU',
      valueTagClass: 12
    },
    {
      name: 'organizationName',
      value: 'Created by aniwei.studio',
      valueTagClass: 12
    }
  ]
}
