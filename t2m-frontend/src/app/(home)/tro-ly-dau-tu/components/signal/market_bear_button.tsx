'use client'
import React, { useEffect, useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import '../../styles.css';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

const MarketBearButton = (props: any) => {

  let checking
  if (props.checkid === 'portion_phase_check') {
    checking = !!props.data[0]?.[props.checkid]
  } else if (props.checkid === 'portion_t3_check') {
    checking = !props.data[0]?.portion_t3_check || props.data[0]?.['down_check']
  } else {
    checking = !props.data[0]?.[props.checkid]
  }

  const checkingtooltip1 = !(props.data[0]?.portion_phase_check != 2)
  const checkingtooltip2 = props.data[0]?.portion_t3_check
  const checkingtooltip3 = !props.data[0]?.['5p_downcheck1']
  const checkingtooltip4 = !props.data[0]?.['5p_downcheck2']
  const checkingtooltip7 = !props.data[0]?.['5p_downcheck']
  const checkingtooltip5 = !props.data[0]?.['20p_downcheck1']
  const checkingtooltip6 = !props.data[0]?.['20p_downcheck2']
  const checkingtooltip8 = !props.data[0]?.['20p_downcheck']
  const checkingtooltip9 = !props.data[0]?.['down_check']

  console.log(checkingtooltip1)

  const buttonColor = checking ? '#24B75E' : '#e14040'
  const buttonBackGround = checking ? 'rgba(36, 183, 94, 0.5)' : 'rgba(225, 64, 64, 0.5)'

  return (
    <>
      <button data-tooltip-id={`market_${props.checkid}`} style={{
        color: buttonColor,
        borderColor: buttonColor,
        backgroundColor: buttonBackGround,
        fontSize: props.fontSize,
        border: '1px solid',
        padding: '2px 5px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        borderRadius: '5px',
        marginLeft: '5px'
      }}>
        {props.name}
        {checking ?
          <CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /> :
          <CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} />
        }
      </button>

      <ReactTooltip id="market_portion_phase_check" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616' }}>
        <p style={{
          fontSize: props.fontSize, fontFamily: 'Calibri, sans-serif', background: '#161616', padding: 0, whiteSpace: 'pre-wrap'
        }}>
          {'Trạng thái hiện tại:  '}
          {checkingtooltip1 ?
            <>
              <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong>
              {'\nThị trường đã rơi vào trạng thái quá bán, nên tiếp tục nắm giữ cổ phiếu'}
            </>
            :
            <>
              <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
              {'\nThị trường chưa tới vùng quá bán, có thể bán cổ phiếu nếu diễn biến xấu'}
            </>
          }
        </p>
      </ReactTooltip>

      <ReactTooltip id="market_portion_t3_check" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616' }}>
        <p style={{
          fontSize: props.fontSize, fontFamily: 'Calibri, sans-serif', background: '#161616', padding: 0, whiteSpace: 'pre-wrap'
        }}>
          {'Hệ thống T2M đánh rủi ro dòng tiền khi bán ra dựa trên 2 điều kiện: '}
          {'\nĐiều kiện thời gian: '}
          {checkingtooltip2 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
          {'\nĐiều kiện tổng thế: '}
          {checkingtooltip9 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
        </p>
      </ReactTooltip>

      <ReactTooltip id="market_down_check" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616' }}>
        <p style={{
          width: '300px', fontSize: props.fontSize, fontFamily: 'Calibri, sans-serif', background: '#161616', padding: 0, whiteSpace: 'pre-wrap'
        }}>
          {'Cấu trúc sóng thị trường được đánh giá dựa trên giá trị hiện tại của các con sóng thị trường, trạng thái hiện tại:  '}
          {checkingtooltip9 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
        </p>
      </ReactTooltip>


      <ReactTooltip id="market_5p_downcheck" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616' }}>
        <p style={{
          fontSize: props.fontSize, fontFamily: 'Calibri, sans-serif', background: '#161616', padding: 0, whiteSpace: 'pre-wrap'
        }}>
          {'Xu hướng sóng tuần được đánh giá dựa trên 3 điều kiện: '}
          {'\nĐiều kiện ngắn hạn: '}
          {checkingtooltip3 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
          {'\nĐiều kiện dài hạn: '}
          {checkingtooltip4 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
          {'\nĐiều kiện tổng thể: '}
          {checkingtooltip7 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
        </p>
      </ReactTooltip>

      <ReactTooltip id="market_20p_downcheck" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616' }}>
        <p style={{
          fontSize: props.fontSize, fontFamily: 'Calibri, sans-serif', background: '#161616', padding: 0, whiteSpace: 'pre-wrap'
        }}>
          {'Xu hướng sóng tháng được đánh giá dựa trên 3 điều kiện: '}
          {'\nĐiều kiện ngắn hạn: '}
          {checkingtooltip5 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
          {'\nĐiều kiện dài hạn: '}
          {checkingtooltip6 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
          {'\nĐiều kiện tổng thể: '}
          {checkingtooltip8 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
        </p>
      </ReactTooltip>
    </>
  )
}

export default MarketBearButton;
