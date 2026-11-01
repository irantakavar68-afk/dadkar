import React from 'react';

export default function PayslipTab(props: any) {
  const { calculations, fontFamily, handlePrintDocument, isAndroid, payslipData, setActiveTab, setPayslipData, user } = props;
  const [includeEidi, setIncludeEidi] = React.useState(false);
  const eidiValue = includeEidi ? (calculations.finalEidi || 0) : 0;
  const taxValue = Math.round(calculations.salaryIncomeTax || 0);

  return (
    <>
          <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              
              {/* هدر کنترل */}
              <div className="flex justify-between items-center mb-6 print:hidden">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">📄 فیش حقوق و دستمزد پرسنلی</h2>
                  <p className="text-xs text-gray-500 mt-1">محاسبه آنی بر اساس مشخصات پروفایل، قانون کار و ضوابط تأمین اجتماعی</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
                  >
                    بازگشت به خانه
                  </button>
                 {!isAndroid && (
                    <button 
                      onClick={() => handlePrintDocument('payslip-print-area')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <span>🖨️</span> چاپ فیش حقوقی
                    </button>
                  )}




                </div>
              </div>

              {/* کنترلر تعاملی ساعت اضافه کار برای اعمال آنی در فیش */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between bg-emerald-50 px-3 py-2 rounded-xl text-emerald-800 text-sm font-medium">
                  <span>ساعات اضافه‌کاری (گرفته شده از بخش محاسبات):</span>
                  <span className="font-bold">{payslipData.overtimeHours} ساعت</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="150"
                    value={payslipData.overtimeHours}
                    onChange={(e) => setPayslipData({...payslipData, overtimeHours: Number(e.target.value) || 0})}
                    className="w-24 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-center font-bold text-gray-900 dark:text-white"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ساعت</span>
                </div>
              </div>

              <label className="flex items-center gap-2 mb-4 text-sm print:hidden">
                <input type="checkbox" checked={includeEidi} onChange={(e) => setIncludeEidi(e.target.checked)} />
                <span>پرداخت عیدی در این ماه (معمولاً اسفند)</span>
              </label>

              {/* کادر فیش حقوقی (طراحی رسمی مجهز به inline style برای چاپ تمیز) */}
              <div id="payslip-print-area" style={{ fontFamily: 'Tahoma, Arial, sans-serif', direction: 'rtl', padding: '24px', background: '#ffffff', color: '#111827', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                
                {/* سربرگ */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1f2937', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{payslipData.workshopName}</h3>
                    <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>سیستم جامع حقوق و دستمزد دادکار</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#047857', margin: '0 0 4px 0' }}>فیش حقوق و مزایای پرسنلی</h2>
                    <span style={{ display: 'inline-block', padding: '2px 10px', background: '#ecfdf5', color: '#065f46', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                      عملکرد ماه: {payslipData.month}
                    </span>
                  </div>
                  <div style={{ textAlign: 'left', fontSize: '11px', color: '#4b5563' }}>
                    <p style={{ margin: 0 }}>تاریخ صدور: {new Date().toLocaleDateString('fa-IR')}</p>
                  </div>
                </div>

                {/* مشخصات */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#f9fafb', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '11px', marginBottom: '20px' }}>
                  <div><span style={{ color: '#6b7280' }}>نام و نام خانوادگی:</span> <strong>{payslipData.empName}</strong></div>
                  <div><span style={{ color: '#6b7280' }}>کد ملی / شناسه:</span> <strong>{payslipData.nationalId}</strong></div>
                  <div><span style={{ color: '#6b7280' }}>وضعیت تأهل و عائله:</span> <strong>{user?.marital_status === 'married' ? 'متأهل (دارای حق تأهل)' : 'مجرد / سایر'}</strong></div>
                </div>

                {/* جداول درآمد و کسورات */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  
                  {/* مزایا */}
                  <div style={{ border: '1px solid #d1d5db', borderRadius: '10px', padding: '14px', background: '#fcfcfc' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#065f46', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', margin: '0 0 10px 0', display: 'flex', justifyContent: 'space-between' }}>
                      <span>مزایای مستمر و رفاهی</span>
                      <span>مبلغ (ریال)</span>
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0' }}>
                      <span>پایه حقوق ماهیانه:</span>
                      <strong>{payslipData.baseSalary.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0' }}>
                      <span>پایه مسکن مصوب:</span>
                      <strong>{payslipData.housingAllowance.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0' }}>
                      <span>بن کارگری (خواربار):</span>
                      <strong>{payslipData.groceryAllowance.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0' }}>
                      <span>حق اولاد (فرزندان):</span>
                      <strong>{payslipData.childAllowance.toLocaleString()}</strong>
                    </div>
                    {user?.marital_status === 'married' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0', color: '#047857' }}>
                        <span>حق تأهل (حق همسر):</span>
                        <strong>{Math.round(5000000).toLocaleString()}</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0' }}>
                      <span>اضافه کاری ({payslipData.overtimeHours} ساعت):</span>
                      <strong>{(payslipData.overtimeHours * payslipData.overtimeRate).toLocaleString()}</strong>
                    </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0' }}>
                        <span>عیدی (پاداش) سالانه{includeEidi ? '' : ' - پرداخت در این ماه نیست'}:</span>
                        <strong>  {eidiValue.toLocaleString()} ریال</strong>
                      </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontWeight: 'bold', fontSize: '12px' }}>
                      <span>جمع مزایای ناخالص:</span>
                      <span>
                        {(
                          payslipData.baseSalary +
                          payslipData.housingAllowance +
                          payslipData.groceryAllowance +
                          payslipData.childAllowance +
                          (user?.marital_status === 'married' ? 5000000 : 0) +
                          (payslipData.overtimeHours * payslipData.overtimeRate) +
                          eidiValue
                        ).toLocaleString()} ریال
                      </span>
                   </div>
                  </div>

                  {/* کسورات */}
                  <div style={{ border: '1px solid #d1d5db', borderRadius: '10px', padding: '14px', background: '#fcfcfc' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#991b1b', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', margin: '0 0 10px 0', display: 'flex', justifyContent: 'space-between' }}>
                      <span>کسورات قانونی</span>
                      <span>مبلغ (ریال)</span>
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0' }}>
                      <span>بیمه سهم کارگر (۷٪ پایه و مزایا):</span>
                      <strong style={{ color: '#991b1b' }}>
                        {payslipData.insuranceDeduction 
                          ? Math.round((payslipData.baseSalary + payslipData.housingAllowance + payslipData.groceryAllowance) * 0.07).toLocaleString() 
                          : '۰'}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0' }}>
                      <span>مالیات بر درآمد حقوق:</span>
                      <strong style={{ color: '#991b1b' }}>
                          {taxValue.toLocaleString()} ریال

                      </strong>
                    </div>

                 <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontWeight: 'bold', fontSize: '12px' }}>
                    <span>جمع کل کسورات:</span>
                    <span>
                      {(
                        (payslipData.insuranceDeduction ? Math.round((payslipData.baseSalary + payslipData.housingAllowance + payslipData.groceryAllowance) * 0.07) : 0) +
                        taxValue
                      ).toLocaleString()} ریال
                    </span>
                </div>

                  </div>

                </div>

                {/* خالص پرداختی */}
                <div style={{ background: '#111827', color: '#ffffff', padding: '14px 20px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#9ca3af', display: 'block' }}>مبلغ قابل پرداخت نهایی به پرسنل:</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#34d399' }}>
                    {(
                        (
                          payslipData.baseSalary +
                          payslipData.housingAllowance +
                          payslipData.groceryAllowance +
                          payslipData.childAllowance +
                          (user?.marital_status === 'married' ? 5000000 : 0) +
                          (payslipData.overtimeHours * payslipData.overtimeRate) +
                          eidiValue
                        ) -
                        (
                          (payslipData.insuranceDeduction ? Math.round((payslipData.baseSalary + payslipData.housingAllowance + payslipData.groceryAllowance) * 0.07) : 0) +
                          taxValue
                        )
                      ).toLocaleString()} ریال

                    </span>
                  </div>
                  <div style={{ textAlign: 'left', fontSize: '10px', color: '#9ca3af' }}>
                    <p style={{ margin: 0 }}>وضعیت: آماده واریز بانکی</p>
                  </div>
                </div>

                            {/* امضاها */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', borderTop: '1px solid #e5e7eb', paddingTop: '20px', textAlign: 'center', fontSize: '11px', color: '#4b5563' }}>
                  <div>
                    <p style={{ fontWeight: 'bold', margin: '0 0 25px 0' }}>امضا و مهر کارفرما / امور مالی</p>
                    <div style={{ borderBottom: '1px dashed #9ca3af', width: '80%', margin: '0 auto' }}></div>
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', margin: '0 0 25px 0' }}>امضا و تأیید دریافت پرسنل</p>
                    <div style={{ borderBottom: '1px dashed #9ca3af', width: '80%', margin: '0 auto' }}></div>
                  </div>
                </div>

              </div>             
            </div>                
          </div>                 
    </>
  );
}
