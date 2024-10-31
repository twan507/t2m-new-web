'use client'
import React, { useEffect, useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import '../../styles.css';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

const MarketBullButton = (props: any) => {

  const checking = props.checkid != 'portion_phase_check' ? !!props.data[0]?.[props.checkid] : !props.data[0]?.[props.checkid]

  const checkingtooltip1 = !!props.data[0]?.portion_raw_check
  const checkingtooltip2 = props.data[0]?.portion_phase_check != 1
  const checkingtooltip3 = props.data[0]?.portion_phase_check != 2
  const checkingtooltip4 = props.data[0]?.portion_phase_check != 3
  const checkingtooltip5 = !!props.data[0]?.['5p_upcheck1']
  const checkingtooltip6 = !!props.data[0]?.['5p_upcheck4']
  const checkingtooltip11 = !!props.data[0]?.['5p_upcheck']
  const checkingtooltip7 = !!props.data[0]?.['20p_upcheck']
  const checkingtooltip8 = !!props.data[0]?.['20p_upcheck1']
  const checkingtooltip12 = !!props.data[0]?.['20p_upcheck4']
  const checkingtooltip9 = !!props.data[0]?.['60p_upcheck']
  const checkingtooltip10 = !!props.data[0]?.['60p_upcheck2']
  const checkingtooltip13 = !!props.data[0]?.['60p_upcheck']
  const checkingtooltip14 = !!props.data[0]?.['up_check']

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

      <ReactTooltip id="market_portion_raw_check" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616' }}>
        <p style={{
          width: '350px', fontSize: props.fontSize, fontFamily: 'Calibri, sans-serif', background: '#161616', padding: 0, whiteSpace: 'pre-wrap'
        }}>
          {'Sức mạnh dòng tiền được đánh giá dựa trên biến động giá và khối lượng giao dịch của từng cổ phiếu trên thị trường, trạng thái hiện tại: '}
          {checkingtooltip1 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
        </p>
      </ReactTooltip>

      <ReactTooltip id="market_portion_phase_check" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616' }}>
        <p style={{
          fontSize: props.fontSize, fontFamily: 'Calibri, sans-serif', background: '#161616', padding: 0, whiteSpace: 'pre-wrap'
        }}>
          {'Hệ thống T2M đánh rủi ro dòng tiền dựa trên 3 điều kiện: '}
          {'\nĐiều kiện xu hướng: '}
          {checkingtooltip2 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
          {'\nĐiều kiện vị thế: '}
          {checkingtooltip3 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
          {'\nĐiều kiện tập trung: '}
          {checkingtooltip4 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
        </p>
      </ReactTooltip>

      <ReactTooltip id="market_up_check" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616' }}>
        <p style={{
          width: '300px', fontSize: props.fontSize, fontFamily: 'Calibri, sans-serif', background: '#161616', padding: 0, whiteSpace: 'pre-wrap'
        }}>
          {'Cấu trúc sóng thị trường được đánh giá dựa trên giá trị hiện tại của các con sóng thị trường, trạng thái hiện tại:  '}
          {checkingtooltip14 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
        </p>
      </ReactTooltip>

      <ReactTooltip id="market_5p_upcheck" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616' }}>
        <p style={{
          fontSize: props.fontSize, fontFamily: 'Calibri, sans-serif', background: '#161616', padding: 0, whiteSpace: 'pre-wrap'
        }}>
          {'Xu hướng sóng tuần được đánh giá dựa trên 3 điều kiện: '}
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
          {checkingtooltip11 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
        </p>
      </ReactTooltip>

      <ReactTooltip id="market_20p_upcheck" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616' }}>
        <p style={{
          fontSize: props.fontSize, fontFamily: 'Calibri, sans-serif', background: '#161616', padding: 0, whiteSpace: 'pre-wrap'
        }}>
          {'Xu hướng sóng tháng được đánh giá dựa trên 3 điều kiện: '}
          {'\nĐiều kiện ngắn hạn: '}
          {checkingtooltip7 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
          {'\nĐiều kiện dài hạn: '}
          {checkingtooltip8 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
          {'\nĐiều kiện tổng thể: '}
          {checkingtooltip12 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
        </p>
      </ReactTooltip>

      <ReactTooltip id="market_60p_upcheck" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616' }}>
        <p style={{
          fontSize: props.fontSize, fontFamily: 'Calibri, sans-serif', background: '#161616', padding: 0, whiteSpace: 'pre-wrap'
        }}>
          {'Xu hướng sóng quý được đánh giá dựa trên 3 điều kiện: '}
          {'\nĐiều kiện ngắn hạn: '}
          {checkingtooltip9 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
          {'\nĐiều kiện dài hạn: '}
          {checkingtooltip10 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
          {'\nĐiều kiện tổng thể: '}
          {checkingtooltip13 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
        </p>
      </ReactTooltip>
    </>
  )
}

export default MarketBullButton;
