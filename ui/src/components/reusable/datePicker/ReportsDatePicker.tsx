import "bootstrap/dist/css/bootstrap.min.css";
import { Range, DateRangePicker } from "react-date-range";
import { useState, useEffect } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Card, Col, Container } from "react-bootstrap";
import "./DatePicker.css";
import "./ReportsDatePicker.css";
import ReportsInsights from "../insights/ReportsInsights";
import ReportsGraphs from "../graphs/ReportsGraphs";
import PdfDownloadBtn from "../buttons/PdfDownloadBtn";

export interface IReportsDateRange {
    dateRange: Range[];
}

function ReportsDatePicker() {
    const now = new Date();
    const firstDayOfTheWeek = now.getDate() - now.getDay() + 1;
    const lastDayOfTheWeek = firstDayOfTheWeek + 6;
    const firstDayOfLastWeek = new Date(now.setDate(firstDayOfTheWeek - 7));
    const lastDayOfLastWeek = new Date(
        new Date().setDate(lastDayOfTheWeek - 7)
    );

    const [state, setState] = useState<Range[]>([
        {
            startDate: firstDayOfLastWeek,
            endDate: lastDayOfLastWeek,
            key: "selection",
        },
    ]);

    const [dateRange, setDateRange] = useState<IReportsDateRange>({
        dateRange: state,
    });

    const today = new Date();

    useEffect(() => {
        const setTheBetweenDates = async () => {
            setDateRange({ dateRange: state });
        };
        setTheBetweenDates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Col
                className="d-flex calendarContainer justify-content-center"
                data-testid="reportsDatePickerElement"
            >
                <Container id="reportData" className="flex-fill reportsData">
                    <ReportsInsights betweenDates={dateRange} />
                    <ReportsGraphs betweenDates={dateRange} />
                </Container>
                <Card className="flex-shrink-1 datePickerCard">
                    <Container className="justify-content-center d-flex mb-4">
                        <PdfDownloadBtn
                            downloadFileName="YourReport"
                            rootElementId="reportData"
                        />
                    </Container>
                    <Card.Header>
                        Select a date range to view your report
                    </Card.Header>
                    <DateRangePicker
                        onChange={(item) => {
                            setState([item.selection]);
                            setDateRange({ dateRange: [item.selection] });
                        }}
                        moveRangeOnFirstSelection={false}
                        months={1}
                        ranges={state}
                        direction="horizontal"
                        preventSnapRefocus={true}
                        calendarFocus="backwards"
                        maxDate={today}
                        staticRanges={[]}
                        inputRanges={[]}
                    />
                    <Container className="justify-content-center d-flex position-absolute bottom-0 mb-4">
                        <PdfDownloadBtn
                            downloadFileName="YourReport"
                            rootElementId="reportData"
                        />
                    </Container>
                </Card>
            </Col>
        </>
    );
}

export default ReportsDatePicker;
