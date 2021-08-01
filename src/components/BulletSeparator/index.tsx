import styled from 'styled-components'

import { COLOR } from 'styles/tokens'

const SPACE_AROUND_BULLET = '0.5em'
const BULLET_SIZE = '0.4em'

export const BulletSeparator = styled.div`
  > * {
    display: inline-block;
  }

  > *:not(:last-child) {
    margin-right: ${SPACE_AROUND_BULLET};
  }

  > * + * {
    position: relative;
    margin-left: ${SPACE_AROUND_BULLET};

    &:before {
      content: '';
      border-radius: 50%;
      display: inline-block;
      position: relative;
      left: -${SPACE_AROUND_BULLET};
      top: -1px;
      vertical-align: middle;
      width: ${BULLET_SIZE};
      height: ${BULLET_SIZE};
      background: ${COLOR.DIVIDER};
    }
  }
`
