import React from 'react'
interface Params {
    className?: string
}
function Search({className}:Params) {
  return (
    <div className={className}>Search</div>
  )
}

export default Search