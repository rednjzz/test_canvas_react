import React, {useState} from 'react'
import { gql, useMutation } from '@apollo/client';
import useInput from '../hooks/useInput';
import {CRANE_DATA_FRAGMENT} from '../fragments';

const DrawImage = () => {
  const [ loading, setLoading] = useState(true);
  const [ craneImage, setcraneImage ] = useState('');
  const [ craneArray, setCraneArray] = useState([]);
  const workDistance = useInput("");
  const workHeight = useInput("");
  const workWidth = useInput("");
  const workWeight = useInput("");
  const blockDistanceInput = useInput("");
  const blockWidthInput = useInput("");
  const blockHeightInput = useInput("");
  const enoughDistance = useInput("");
  const [safeFactor, setSafeFactor] = useState("85");
  const [craneLocation, setCraneLocation] = useState("back");

  const dummyData = "{\r\n        \"craneName\": \"L_1750_9.1\",\r\n        \"craneCode\": \"TYVEN\",\r\n        \"craneModeName\": \"LUFFING\",\r\n        \"excelSheetName\": \"TYVEN_204t_t_198_007_01401\",\r\n        \"craneData\": {\r\n          \"mainBoom\": 49.1,\r\n          \"mainAngle\": 84,\r\n          \"totalExtLength\": 9,\r\n          \"adapter1\": 4,\r\n          \"extBoom1\": 5,\r\n          \"extBoom2\": 0,\r\n          \"extBoom3\": 0,\r\n          \"extBoom4\": 0,\r\n          \"adapter2\": 0,\r\n          \"flyFixLuffing\": 70,\r\n          \"flyFixLuffingAngle\": 15.700000000000003,\r\n          \"distance1\": 6.1,\r\n          \"distance2\": 25.9,\r\n          \"craneDistance\": 8.33,\r\n          \"centerToBuildingDistance\": 27,\r\n          \"centerToBlockDistance\": 27,\r\n          \"craneToBuildingDistance\": 18.7,\r\n          \"craneToBlockDistance\": 18.7,\r\n          \"totalDistance\": 32,\r\n          \"tableDistance\": 32,\r\n          \"height1\": 57.8,\r\n          \"height2\": 65,\r\n          \"totalHeight\": 124.8,\r\n          \"marginHeight\": 8.8,\r\n          \"workingArea\": 360,\r\n          \"tableWeight\": 26.1,\r\n          \"counterWeight\": \"204\",\r\n          \"overRear\": \"x\",\r\n          \"optional\": \"x\",\r\n          \"safetyFactor\": 81.4,\r\n          \"craneLocation\": \"back\",\r\n          \"workWeight\": 25,\r\n          \"workBuilding\": {\r\n            \"horizontal\": 5,\r\n            \"vertical\": 5,\r\n            \"height\": 110\r\n          },\r\n          \"block\": {\r\n            \"vertical1\": 0,\r\n            \"horizontal1\": 0,\r\n            \"height1\": 0,\r\n            \"vertical2\": 0,\r\n            \"height2\": 0\r\n          }\r\n        }\r\n      }";
  const GET_CRANEIMGAGEV2 = gql`
    mutation getCraneImageV2($craneData: String!) {
      getCraneImageV2(craneData: $craneData)
    }
  `;
  const GET_CRANE_LIST_V2 = gql`
  mutation getCraneListV2(
    $safetyFactor: Float!
    $craneLocation: String!
    $workBuilding: workBuildingInput!
    $workWeight: Float!
    $block: BlockInput
  ) {
    getCraneListV2(
      safetyFactor: $safetyFactor
      craneLocation: $craneLocation
      workBuilding: $workBuilding
      workWeight: $workWeight
      block: $block
    ) {
      craneName
      craneCode
      craneModeName
      excelSheetName
      craneData {
        ...CraneDataParts
      }
    }
  }
  ${CRANE_DATA_FRAGMENT}
`;

  const [CraneDataV2Mutation] = useMutation(GET_CRANEIMGAGEV2, {
    variables: { craneData: dummyData}
  });
  const [craneListMutation] = useMutation(GET_CRANE_LIST_V2, {
    variables: {
    },
  });

  const onClick = async () => {
    setLoading(true);
    try {
      const {
        data: { getCraneImageV2: imageData }
      } = await CraneDataV2Mutation();
      setcraneImage( imageData );
    } catch(e) {
      console.log(e);
      alert("Image loading error");
    } finally {
      setLoading(false);
    }
  };
  const loadImageHandler = async (crane, e) => {
    setLoading(true);
    try {
      console.log("뮤테이션시작2")
      console.log(crane);
      const {
        data: { getCraneImageV2: imageData }
      } = await CraneDataV2Mutation({variables: { craneData: JSON.stringify(crane) }});
      setcraneImage( imageData );
      
      console.log("뮤테이션끝2")
    } catch(e) {
      console.log(e);
      alert("Image loading error");
    } finally {
      setLoading(false);
    }
  }
  const handleRigging = async (evt) => {
    evt.preventDefault();
    const workDistanceV = workDistance.value;
    const workHeightV = workHeight.value;
    const workWeightV = workWeight.value;
    
    if (workDistanceV === "" || workDistanceV.includes(" ")) {
      return alert("작업 거리를 입력해주세요.");
    } else if (workHeightV === "" || workHeightV.includes(" ")) {
      return alert("작업 높이를 입력해주세요.");
    } else if (workWeightV === "" || workWeightV.includes(" ")) {
      return alert("작업 무게를 입력해주세요.(후크 무게 포함)");
    } else {
      try {
        console.log("뮤테이션시작")
        setLoading(true);
        const {
          data: {getCraneListV2: craneArrayData}
        } = await craneListMutation({
          variables: {
            safetyFactor: parseFloat(safeFactor),
            craneLocation: craneLocation.toString(),
            workBuilding: {
              horizontal: 0,
              vertical: parseFloat(workDistance.value), //빌딩 폭
              height: parseFloat(workHeight.value), // 빌딩 높이
            },
            workWeight: parseFloat(workWeight.value), // 작업물 무게
            block: {
              vertical1: parseFloat(blockDistanceInput.value), //장애물 폭
              horizontal1: 0,
              height1: parseFloat(blockHeightInput.value),
              vertical2: parseFloat(enoughDistance.value),
              height2: 0,
            },
          },
        });
        setCraneArray(craneArrayData);
        // sessionStorage.setItem("craneList", JSON.stringify(craneArrayData));
      } catch (e) {
        console.log(e);
        alert("알 수 없는 에러");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <>
      <h1 style={{margin:"0 100px"}}>리깅 테스트 리액트</h1>
      <div style={{margin:"10px"}}>
        {/* <button style={{display: "block"}} onClick={onClick}>이미지 로딩</button> */}
          <div style={{display:"inline-block"}}>
            <div style={{width:"500px",borderWidth:"1px", borderStyle:"solid"}}>
              <form onSubmit={handleRigging}>
                <input  {...workDistance} placeholder="vertical"/>
                <input  {...workHeight} placeholder="height"/>
                <input  {...workWeight} placeholder="workWeight"/>
                <input  {...blockDistanceInput} placeholder="vertical1"/>
                <input  {...blockHeightInput} placeholder="height1"/>
                <input  {...enoughDistance } placeholder="vertical2"/>
                <input type="submit" value="Submit" />
              </form>
            </div>
            <ul>
              {craneArray.map((crane, index) => {
                return (<li key={crane.craneName + crane.craneCode}><button onClick={(e) => loadImageHandler(crane,e)}>{`${crane.craneName} | ${crane.craneCode}`}</button></li>)
              })}
            </ul>
          </div>
          <div style={{display:"inline-block"}}>
            {loading ? 
            <div>로딩중...</div> :
            <div style={{borderWidth:"1px", borderStyle:"solid", margin:"0 10px 0 10px", display:"inline-block"}}>
              <img alt="crane 이미지" style={{width:"500px"}} src={craneImage}/>
            </div>}
          </div>
      </div>
    </>
  )
}

export default DrawImage