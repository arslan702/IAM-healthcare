import { Tooltip } from 'antd'
import React from 'react'

function Tooltips({title, text}) {
  return (
    <Tooltip title={title} color='#f87171'>
        {text}
    </Tooltip>
  )
}

export default Tooltips