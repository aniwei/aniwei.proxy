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
  size: 2048
}
