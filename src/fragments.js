import { gql } from '@apollo/client';

export const CRANE_DATA_FRAGMENT = gql`
  fragment CraneDataParts on CraneData {
    mainBoom
    mainAngle
    totalExtLength
    adapter1
    extBoom1
    extBoom2
    extBoom3
    extBoom4
    adapter2
    flyFixLuffing
    flyFixLuffingAngle
    distance1
    distance2
    craneDistance
    centerToBuildingDistance
    centerToBlockDistance
    craneToBuildingDistance
    craneToBlockDistance
    totalDistance
    tableDistance
    height1
    height2
    totalHeight
    marginHeight
    workingArea
    tableWeight
    counterWeight
    overRear
    optional
    safetyFactor
    craneLocation
    workWeight
    workBuilding {
      horizontal
      vertical
      height
    }
    block {
      vertical1
      horizontal1
      height1
      vertical2
      height2
    }
    edgeDistance {
      mainToBlock,
      mainToBuilding,
      flyFixLuffingToBlock,
      flyFixLuffingToBuilding,
    }
  }
  `;