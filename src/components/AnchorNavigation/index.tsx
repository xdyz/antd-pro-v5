import React from 'react'
import { Anchor } from 'antd'

const { Link } = Anchor

type BlockListParams = {
  name: string,
  type: string,
  items: Record<string, any>[]
}

type AnchorNavigationParams = {
  blocksList?: BlockListParams[]
}

const AnchorNavigation: React.FC<AnchorNavigationParams> = (props) => {

  const { blocksList } = props
  return (
    <>
      <Anchor targetOffset={100} offsetTop={100} showInkInFixed={true} getContainer={() => window}>
        {
          blocksList && blocksList.map((item) => {
            return (
              <Link href={`#${item.type}-${item.name}`} title={item.name} key={`${item.type}-${item.name}`}></Link>
            )
          })
        }
      </Anchor>
    </>
  )
}

export default AnchorNavigation