'use client'
import React, { useEffect, useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import '../../styles.css';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

const IndustryBullButton = (props: any) => {

  const checking = props.checkid != 'portion_phase_check' ? !!props.data.filter((item: any) => item.industry === props.industry)[0]?.[props.checkid] : !props.data.filter((item: any) => item.industry === props.industry)[0]?.[props.checkid]

  const checkingtooltip1 = !!props.data.filter((item: any) => item.industry === props.industry)[0]?.portion_raw_check
  const checkingtooltip2 = props.data.filter((item: any) => item.industry === props.industry)[0]?.portion_phase_check != 1
  const checkingtooltip3 = !!props.data.filter((item: any) => item.industry === props.industry)[0]?.['5p_upcheck1']
  const checkingtooltip4 = !!props.data.filter((item: any) => item.industry === props.industry)[0]?.['5p_upcheck4']
  const checkingtooltip5 = !!props.data.filter((item: any) => item.industry === props.industry)[0]?.['5p_upcheck']
  const checkingtooltip8 = !!props.data.filter((item: any) => item.industry === props.industry)[0]?.['20p_upcheck']
  const checkingtooltip9 = !!props.data.filter((item: any) => item.industry === props.industry)[0]?.['up_check']

  const buttonColor = checking ? '#24B75E' : '#e14040'
  const buttonBackGround = checking ? 'rgba(36, 183, 94, 0.5)' : 'rgba(225, 64, 64, 0.5)'

  return (
    <>
      <button data-tooltip-id={`industry_${props.checkid}`} style={{
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

      <ReactTooltip id="industry_portion_raw_check" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616', zIndex: 1 }}>
        <p style={{
          width: '350px', fontSize: props.fontSize, fontFamily: 'Calibri, sans-serif', background: '#161616', padding: 0, whiteSpace: 'pre-wrap'
        }}>
          {'Sức mạnh dòng tiền được đánh giá dựa trên biến động giá và khối lượng giao dịch của từng cổ phiếu trong ngành, trạng thái hiện tại: '}
          {checkingtooltip1 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
        </p>
      </ReactTooltip>

      <ReactTooltip id="industry_portion_phase_check" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616', zIndex: 1 }}>
        <p style={{
          width: '290px', fontSize: props.fontSize, fontFamily: 'Calibri, sans-serif', background: '#161616', padding: 0, whiteSpace: 'pre-wrap'
        }}>
          {'Hệ thống T2M đánh rủi ro dòng tiền ngành dựa trên điều kiện xu hướng của dòng tiền, trạng thái hiện tại: '}
          {checkingtooltip2 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
        </p>
      </ReactTooltip>

      <ReactTooltip id="industry_up_check" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616', zIndex: 1 }}>
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

      <ReactTooltip id="industry_5p_upcheck" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616', zIndex: 1 }}>
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
          {checkingtooltip5 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
        </p>
      </ReactTooltip>

      <ReactTooltip id="industry_20p_upcheck" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616', zIndex: 1 }}>
        <p style={{
          width: '250px', fontSize: props.fontSize, fontFamily: 'Calibri, sans-serif', background: '#161616', padding: 0, whiteSpace: 'pre-wrap'
        }}>
          {'Xu hướng sóng tháng của ngành được đánh giá dựa trên điều kiện tổng thể, trạng thái hiện tại:  '}
          {checkingtooltip8 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
        </p>
      </ReactTooltip>
    </>
  )
}

export default IndustryBullButton;
