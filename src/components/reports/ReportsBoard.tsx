'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import type { CargoReport } from './CargoReport';
import { calculateCargoReportsBalance, filterReportsByMonth } from './cargoReportsBalance';
import { loadCargoReports, saveCargoReports } from './cargoReportsStorage';
import { DayNavigator } from './DayNavigator';
import { MonthlyBalance } from './MonthlyBalance';
import { shiftIsoDate, todayIsoDate } from './reportDates';
import { ReportForm } from './ReportForm';
import { ReportsTable } from './ReportsTable';

export const ReportsBoard = () => {
  const t = useTranslations('ReportsBoard');
  const [reports, setReports] = useState<CargoReport[]>([]);
  const [selectedDay, setSelectedDay] = useState(todayIsoDate());

  useEffect(() => {
    setReports(loadCargoReports());
  }, []);

  const handleAdd = (report: CargoReport) => {
    setReports((previous) => {
      const next = [...previous, report];
      saveCargoReports(next);
      return next;
    });
    setSelectedDay(report.date);
  };

  const handleDelete = (id: string) => {
    setReports((previous) => {
      const next = previous.filter((report) => report.id !== id);
      saveCargoReports(next);
      return next;
    });
  };

  const dayReports = reports.filter((report) => report.date === selectedDay);
  const dayBalance = calculateCargoReportsBalance(dayReports);
  const monthReports = filterReportsByMonth(reports, selectedDay.slice(0, 7));
  const monthBalance = calculateCargoReportsBalance(monthReports);
  const overallTotal = calculateCargoReportsBalance(reports).totalFreightValue;

  return (
    <div className="flex flex-col gap-6">
      <DayNavigator
        day={selectedDay}
        loadCount={dayBalance.loadCount}
        dayTotal={dayBalance.totalFreightValue}
        onPrevious={() =>{  setSelectedDay((day) => shiftIsoDate(day, -1)); }}
        onNext={() =>{  setSelectedDay((day) => shiftIsoDate(day, 1)); }}
        onToday={() =>{  setSelectedDay(todayIsoDate()); }}
      />

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('form_title')}</h2>
        <ReportForm onAdd={handleAdd} />
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <ReportsTable reports={dayReports} onDelete={handleDelete} />
      </section>

      <MonthlyBalance monthBalance={monthBalance} overallTotal={overallTotal} />
    </div>
  );
};
