'use client'
import React, { useEffect, useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import '../../styles.css';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

const MarketBearButton = (props: any) => {

  const checking = !['portion_t3_check', 'portion_phase_check'].includes(props.checkid) ? !props.data[0]?.[props.checkid] : !!props.data[0]?.[props.checkid];


  const checkingtooltip1 = !(props.data[0]?.portion_phase_check != 2)
  const checkingtooltip2 = props.data[0]?.portion_t3_check
  const checkingtooltip3 = !props.data[0]?.['5p_downcheck1']
  const checkingtooltip4 = !props.data[0]?.['5p_downcheck2']
  const checkingtooltip7 = !props.data[0]?.['5p_downcheck']
  const checkingtooltip5 = !props.data[0]?.['20p_downcheck1']
  const checkingtooltip6 = !props.data[0]?.['20p_downcheck2']
  const checkingtooltip8 = !props.data[0]?.['20p_downcheck']

  const buttonColor = checking ? '#24B75E' : '#e14040'
  const buttonBackGround = checking ? 'rgba(36, 183, 94, 0.5)' : 'rgba(225, 64, 64, 0.5)'

  return (
    <>
      <button data-tooltip-id={props.checkid} style={{
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

      <ReactTooltip id="portion_phase_check" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616' }}>
        <p style={{
          fontSize: props.fontSize, fontFamily: 'Calibri, sans-serif', background: '#161616', padding: 0, whiteSpace: 'pre-wrap'
        }}>
          {'Theo hệ thống T2M, vị thế nắm giữ có thể có 2 trạng thái: \n'}
          <strong style={{ color: "#24B75E" }}>Đạt</strong>
          {' Thị trường rơi vào trạng thái quá bán, nên tiếp tục nắm giữ cổ phiếu\n'}
          <strong style={{ color: "#e14040" }}>Không đạt</strong>
          {' Thị trường chưa tới vùng quá bán, có thể bán cổ phiếu nếu diễn biến xấu\n'}
          {'Trạng thái hiện tại:  '}
          {checkingtooltip1 ?
            <strong style={{ color: "#24B75E" }}>Đạt<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Không đạt<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
        </p>
      </ReactTooltip>

      <ReactTooltip id="portion_t3_check" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616' }}>
        <p style={{
          width: '350px', fontSize: props.fontSize, fontFamily: 'Calibri, sans-serif', background: '#161616', padding: 0, whiteSpace: 'pre-wrap'
        }}>
          {'Trạng thái nắm giữ cổ phiếu phải có thời gian tối thiếu T+2, trạng thái hiện tại: '}
          {checkingtooltip2 ?
            <strong style={{ color: "#24B75E" }}>Chưa thể bán<CheckCircleTwoTone twoToneColor="#24B75E" style={{ marginLeft: '7px' }} /></strong> :
            <strong style={{ color: "#e14040" }}>Có thể bán<CloseCircleTwoTone twoToneColor="#e14040" style={{ marginLeft: '7px' }} /></strong>
          }
        </p>
      </ReactTooltip>

      <ReactTooltip id="5p_downcheck" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616' }}>
        <p style={{
          fontSize: props.fontSize, fontFamily: 'Calibri, sans-serif', background: '#161616', padding: 0, whiteSpace: 'pre-wrap'
        }}>
          {'Cấu trúc sóng tuần được đánh giá dựa trên 3 điều kiện: '}
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

      <ReactTooltip id="20p_downcheck" place="bottom" style={{ padding: '0px 10px', borderRadius: '5px', background: '#161616' }}>
        <p style={{
          fontSize: props.fontSize, fontFamily: 'Calibri, sans-serif', background: '#161616', padding: 0, whiteSpace: 'pre-wrap'
        }}>
          {'Cấu trúc sóng tháng được đánh giá dựa trên 3 điều kiện: '}
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
