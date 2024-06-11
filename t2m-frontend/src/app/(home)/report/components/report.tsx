'use client'
import Link from "next/link";
import { useEffect, useState } from "react";


const DailyReport = (props: any) => {
    const data = props?.data

    const report_datetime = data?.filter((item: any) => item.name === 'report_datetime')?.[0]?.value
    const report_date = data?.filter((item: any) => item.name === 'report_date')?.[0]?.value
    const market_sentiment = data?.filter((item: any) => item.name === 'market_sentiment')?.[0]?.value
    const liquidity = data?.filter((item: any) => item.name === 'liquidity')?.[0]?.value
    const vnindex_close = data?.filter((item: any) => item.name === 'vnindex_close')?.[0]?.value
    const vnindex_change_percent = data?.filter((item: any) => item.name === 'vnindex_change_percent')?.[0]?.value
    const vnindex_change_value = data?.filter((item: any) => item.name === 'vnindex_change_value')?.[0]?.value
    const market_volume = data?.filter((item: any) => item.name === 'market_volume')?.[0]?.value
    const market_value = data?.filter((item: any) => item.name === 'market_value')?.[0]?.value
    const tang_gia = data?.filter((item: any) => item.name === '%_tang_gia')?.[0]?.value
    const giam_gia = data?.filter((item: any) => item.name === '%_giam_gia')?.[0]?.value
    const khong_doi = data?.filter((item: any) => item.name === '%_khong_doi')?.[0]?.value
    const vn30f1m_close = data?.filter((item: any) => item.name === 'vn30f1m_close')?.[0]?.value
    const vn30f1m_change_value = data?.filter((item: any) => item.name === 'vn30f1m_change_value')?.[0]?.value
    const vn30f1m_volume = data?.filter((item: any) => item.name === 'vn30f1m_volume')?.[0]?.value
    const score_hsA = data?.filter((item: any) => item.name === 'score_hsA')?.[0]?.value
    const liquidity_hsA = data?.filter((item: any) => item.name === 'liquidity_hsA')?.[0]?.value
    const inflow_hsA = data?.filter((item: any) => item.name === 'inflow_hsA')?.[0]?.value
    const outflow_hsA = data?.filter((item: any) => item.name === 'outflow_hsA')?.[0]?.value
    const top_group_hsA = data?.filter((item: any) => item.name === 'top_group_hsA')?.[0]?.value
    const score_hsB = data?.filter((item: any) => item.name === 'score_hsB')?.[0]?.value
    const liquidity_hsB = data?.filter((item: any) => item.name === 'liquidity_hsB')?.[0]?.value
    const inflow_hsB = data?.filter((item: any) => item.name === 'inflow_hsB')?.[0]?.value
    const outflow_hsB = data?.filter((item: any) => item.name === 'outflow_hsB')?.[0]?.value
    const top_group_hsB = data?.filter((item: any) => item.name === 'top_group_hsB')?.[0]?.value
    const score_hsC = data?.filter((item: any) => item.name === 'score_hsC')?.[0]?.value
    const liquidity_hsC = data?.filter((item: any) => item.name === 'liquidity_hsC')?.[0]?.value
    const inflow_hsC = data?.filter((item: any) => item.name === 'inflow_hsC')?.[0]?.value
    const outflow_hsC = data?.filter((item: any) => item.name === 'outflow_hsC')?.[0]?.value
    const top_group_hsC = data?.filter((item: any) => item.name === 'top_group_hsC')?.[0]?.value
    const score_hsD = data?.filter((item: any) => item.name === 'score_hsD')?.[0]?.value
    const liquidity_hsD = data?.filter((item: any) => item.name === 'liquidity_hsD')?.[0]?.value
    const inflow_hsD = data?.filter((item: any) => item.name === 'inflow_hsD')?.[0]?.value
    const outflow_hsD = data?.filter((item: any) => item.name === 'outflow_hsD')?.[0]?.value
    const top_group_hsD = data?.filter((item: any) => item.name === 'top_group_hsD')?.[0]?.value
    const name_bot_cap = data?.filter((item: any) => item.name === 'name_bot_cap')?.[0]?.value
    const score_bot_cap = data?.filter((item: any) => item.name === 'score_bot_cap')?.[0]?.value
    const liquidity_bot_cap = data?.filter((item: any) => item.name === 'liquidity_bot_cap')?.[0]?.value
    const inflow_bot_cap = data?.filter((item: any) => item.name === 'inflow_bot_cap')?.[0]?.value
    const outflow_bot_cap = data?.filter((item: any) => item.name === 'outflow_bot_cap')?.[0]?.value
    const name_top_cap = data?.filter((item: any) => item.name === 'name_top_cap')?.[0]?.value
    const score_top_cap = data?.filter((item: any) => item.name === 'score_top_cap')?.[0]?.value
    const liquidity_top_cap = data?.filter((item: any) => item.name === 'liquidity_top_cap	')?.[0]?.value
    const inflow_top_cap = data?.filter((item: any) => item.name === 'inflow_top_cap')?.[0]?.value
    const outflow_top_cap = data?.filter((item: any) => item.name === 'outflow_top_cap')?.[0]?.value
    const top5_stock = data?.filter((item: any) => item.name === 'top5_stock')?.[0]?.value
    const bot5_stock = data?.filter((item: any) => item.name === 'bot5_stock')?.[0]?.value

    const [checkAuth, setCheckAuth] = useState(true);
    useEffect(() => {
        setCheckAuth(false)
    }, []);

    if (!checkAuth) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '100px' }}>
                <span className='ul-daily-report'>
                    ({report_datetime})
                </span>
                <span className='daily-report'>
                    Nhật ký thị trường ngày {report_date}.
                </span>
                <br />
                <span className='daily-report'>
                    Kết thúc phiên giao dịch, toàn thị trường có {tang_gia} mã tăng giá, {giam_gia} mã tăng giá và {khong_doi} mã không đổi, trạng thái tâm lý ở mức {market_sentiment}, chỉ số thanh khoản đạt {liquidity}.
                </span>
                <br />
                <span className='daily-report'>
                    VNINDEX đóng cửa ở mức {vnindex_close} ({vnindex_change_value}/{vnindex_change_percent}) điểm, với khối lượng {market_volume} và giá trị giao dịch đạt {market_value}. Chỉ số phái sinh VN30F1M đóng cửa ở mức {vn30f1m_close} ({vn30f1m_change_value}) điểm, với khối lượng {vn30f1m_volume} hợp đồng.
                </span>
                <br />
                <span className='ul-daily-report'>
                    Dòng tiền các nhóm hiệu suất:
                </span>
                <span className='li-daily-report'>- Nhóm hiệu suất A điểm dòng tiền ở mức {score_hsA} điểm với chỉ số thanh khoản {liquidity_hsA}, trong đó có {inflow_hsA} cổ phiếu có dòng tiền vào và {outflow_hsA} có dòng tiền ra. Các ngành trong nhóm có {top_group_hsA}.</span>
                <span className='li-daily-report'>- Nhóm hiệu suất B điểm dòng tiền ở mức {score_hsB} điểm với chỉ số thanh khoản {liquidity_hsB}, trong đó có {inflow_hsB} cổ phiếu có dòng tiền vào và {outflow_hsB} có dòng tiền ra. Các ngành trong nhóm có {top_group_hsB}.</span>
                <span className='li-daily-report'>- Nhóm hiệu suất C điểm dòng tiền ở mức {score_hsC} điểm với chỉ số thanh khoản {liquidity_hsC}, trong đó có {inflow_hsC} cổ phiếu có dòng tiền vào và {outflow_hsC} có dòng tiền ra. Các ngành trong nhóm có {top_group_hsC}.</span>
                <span className='li-daily-report'>- Nhóm hiệu suất D điểm dòng tiền ở mức {score_hsD} điểm với chỉ số thanh khoản {liquidity_hsD}, trong đó có {inflow_hsD} cổ phiếu có dòng tiền vào và {outflow_hsD} có dòng tiền ra. Các ngành trong nhóm có {top_group_hsD}.</span>
                <br />
                <span className='ul-daily-report'>
                    Dòng tiền các nhóm vốn hoá:
                </span>
                <span className='li-daily-report'>- Nhóm vốn hoá {name_top_cap} có dòng tiền mạnh nhất ở mức {score_top_cap} điểm với chỉ số thanh khoản {liquidity_top_cap}, trong đó có {inflow_top_cap} cổ phiếu có dòng tiền vào và {outflow_top_cap} có dòng tiền ra.</span>
                <span className='li-daily-report'>- Nhóm vốn hoá {name_bot_cap} có dòng tiền mạnh nhất ở mức {score_bot_cap} điểm với chỉ số thanh khoản {liquidity_bot_cap}, trong đó có {inflow_bot_cap} cổ phiếu có dòng tiền vào và {outflow_bot_cap} có dòng tiền ra.</span>
                <br />
                <span className='daily-report'>
                    Top 5 cổ phiếu có dòng tiền vào tốt nhất thị trường: {top5_stock}.
                </span>
                <span className='daily-report'>
                    Top 5 cổ phiếu có dòng tiền ra nhiều nhất thị trường: {bot5_stock}.
                </span>
                <br />
                <span className='ul-daily-report'>
                    #t2minvest
                </span>
                <span className='daily-report'>
                    {'>>> 🗒 Đăng kí sử dụng hệ thống T2M Invest: '} <Link href='https://t2m.vn'>https://t2m.vn</Link>
                </span>
                <span className='daily-report'>
                    {'>>> ☘️ Tham gia Zalo cộng đồng T2M Invest: '} <Link href='https://zalo.me/g/fggvuq311'>https://zalo.me/g/fggvuq311</Link>
                </span>
                <span className='daily-report'>
                    {'>>> 📬 Tham gia Telegram cộng đồng T2M Invest: '} <Link href='https://zalo.me/g/fggvuq311'>https://t.me/+dfQWJsAaORljNzNl</Link>
                </span>
            </div>
        )
    }
}

export default DailyReport