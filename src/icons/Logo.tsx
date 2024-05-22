import React from 'react'
interface Params {
    className?: string
}
function Logo({className}:Params) {
  return (
    <svg className={className}    viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 16v-8h2.5a2.5 2.5 0 1 1 0 5h-2.5" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /></svg>
  )
}

export default Logo