export default function namespace (prefix) {
  return function (chunk, state) {
    const chunkNameSpace = chunk ? `-${chunk}` : '';
    const stateNameSpace = state ? `_${state}` : '';
    const name = `${prefix}${chunkNameSpace}${stateNameSpace}`;

    return name
  }
}