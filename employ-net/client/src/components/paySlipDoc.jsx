import React from "react";
// import {Page, Document, Image, StyleSheet, Text} from "@react-pdf/renderer";
import logo from "./logo.js";
import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
} from "@react-pdf/renderer";
import axios from "axios";
import { useState, useContext } from "react";
import { usercontext } from "../context/UserContext";

const styles = StyleSheet.create({
    page: {
        fontFamily: "Helvetica",
        fontSize: 11,
        paddingTop: 30,
        paddingLeft: 60,
        paddingRight: 60,
        lineHeight: 1.5,
        // flexDirection: 'column',
    },
    logo: {
        width: 74,
        height: 66,
        marginLeft: "auto",
        marginRight: "auto",
    },
});

const PaySlipDoc = () => {
    const [showPayslipModal, setShowPayslipModal] = useState(false);
    const [payslipContent, setPayslipContent] = useState(null);

    const navigateToRequestPayslip = async () => {
        console.log("Navigate to Request Payslip");
        // Simply getting the payslip information from the server
        try {
            const response = await axios.get(
                `https://employnet.onrender.com/api/payslip/request-payslip/${user._id}`,
                { withCredentials: true }
            );
            console.log("Response from api:", response.data);

            setPayslipContent(response.data); // Set the payslip content
            setShowPayslipModal(true); // Show the modal
        } catch (error) {
            console.error("Error during request payslip:", error);
        }
    };

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const currentMonth = monthNames[new Date().getMonth()];

    const [daysPresent, setDaysPresent] = useState(null);
    const [monthlyHoursWorked, setMonthlyHoursWorked] = useState(null);

    const [enrolledBenefits, setEnrolledBenefits] = useState([]);

    const getEmployeeAttendance = async () => {
        try {
            const response = await axios.get(
                `https://employnet.onrender.com/api/attendance/retrieve-attendance/${user._id}`,
                { withCredentials: true }
            );
            console.log("Response from api:", response.data);
            setDaysPresent(response.data.record.totalDaysPresent);
            setMonthlyHoursWorked(response.data.record.totalMonthlyHoursWorked);
        } catch (error) {
            console.error("Error during attendance:", error);
        }
    };

    // React.useEffect(() => {
    //     const getEnrolledBenefits = async () => {
    //         try {
    //             const response = await axios.get(
    //                 `https://employnet.onrender.com/api/benefits/all-enrollment-benefits/${user._id}`,
                        // {withCredentials: true}
    //             );

    //             // Transform the array to an object with benefitType as keys and isEnrolled as values
    //             setEnrolledBenefits(
    //                 response.data.map((each) => {
    //                     return {
    //                         benefitType: each.benefitType,
    //                         isEnrolled: each.isEnrolled,
    //                         allowanceAmount: each.allowanceAmount,
    //                     };
    //                 })
    //             );
    //             console.log("Enrolled benefits:", enrolledBenefits);
    //         } catch (error) {
    //             console.error("Error fetching data or setting state:", error);
    //         }
    //     };
    //     getEnrolledBenefits();
    // }, []);

    const { user } = useContext(usercontext);
    const styles = StyleSheet.create({
        page: {
            fontFamily: "Helvetica",
            padding: 30,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
        },
        logo: {
            width: 100,
            height: 100,
        },
        titleContainer: {
            textAlign: "center",
            alignItems: "center",
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
        },
        subtitle: {
            fontSize: 16,
        },
        timestamp: {
            fontSize: 12,
            textAlign: "right",
        },
        section: {
            marginTop: 30,
        },
        table: {
            display: "table",
            width: "auto",
        },
        tableRow: {
            margin: "auto",
            flexDirection: "row",
            marginBottom: 15,
        },
        tableCol: {
            width: "25%",
        },
        tableCell: {
            margin: "auto",
            marginTop: 5,
            fontSize: 10,
        },
        footer: {
            marginTop: "auto",
            padding: 10,
            fontSize: 10,
            alignItems: "center",
        },
        footerTitle: {
            fontWeight: "bold",
            textAlign: "center",
        },
        footerSubTitle: {
            textAlign: "center",
        },
        line: {
            borderBottomColor: "black",
            borderBottomWidth: 1,
            marginTop: 2.5,
            marginBottom: 10,
        },
        personalInfo: {
            marginBottom: 20,
            marginVertical: 10,
            fontSize: 10,
        },
        tableRowInfo: {
            margin: "auto",
            flexDirection: "row",
            marginBottom: 15,
            justifyContent: "flex-end",
        },
        tableColInfo: {
            width: "75%",
        },
    });

    // const enrolledEls = enrolledBenefits.map((each) => {
    //     return (
    //         <View style={styles.tableRow}>
    //             <View style={styles.tableCol}>
    //                 <Text style={styles.tableCell}>{each.benefitType}</Text>
    //             </View>
    //             <View style={styles.tableCol}>
    //                 <Text style={styles.tableCell}>
    //                     {each.isEnrolled ? "Enrolled" : "Not Enrolled"}
    //                 </Text>
    //             </View>
    //         </View>
    //     );
    // });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Image style={styles.logo} src={logo} />
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>SALARY SLIP</Text>
                        <Text style={styles.subtitle}>
                            Salary Slip for the month of {currentMonth}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.timestamp}>
                            Date:{new Date().toLocaleDateString("en-US",  { timeZone: 'Asia/Karachi' })}
                        </Text>
                        <Text style={styles.timestamp}>
                            Time:{new Date().toLocaleTimeString("en-US",  { timeZone: 'Asia/Karachi' })}
                        </Text>
                    </View>
                </View>
                <View style={styles.line} />

                <View style={styles.personalInfo}>
                    <View style={styles.tableRowInfo}>
                        <View style={styles.tableColInfo}>
                            <Text>
                                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                                    Name:
                                </Text>{" "}
                                {user.FirstName} {user.LastName}
                            </Text>
                            <Text>
                                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                                    Role:
                                </Text>{" "}
                                {user.Role}
                            </Text>
                            <Text>
                                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                                    Employee ID:
                                </Text>{" "}
                                {user._id}
                            </Text>
                            <Text>
                                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                                    Email:
                                </Text>{" "}
                                {user.Email}
                            </Text>
                        </View>
                        <View style={styles.tableColInfo}>
                            <Text>
                                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                                    Date of Joining:
                                </Text>{" "}
                                {new Date(user.createdAt).toLocaleDateString("en-US",  { timeZone: 'Asia/Karachi' })}
                            </Text>
                            <Text>
                                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                                    Total Working Days:
                                </Text>{" "}
                                {daysPresent}
                            </Text>
                            <Text>
                                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                                    Total Hours Worked:
                                </Text>{" "}
                                {Math.round(monthlyHoursWorked)} hours
                            </Text>
                            <Text>
                                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                                    Days at Organization:
                                </Text>{" "}
                                {Math.floor(
                                    (new Date() - new Date(user.createdAt)) /
                                        (1000 * 60 * 60 * 24)
                                )}{" "}
                                days
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.line} />
                <View style={styles.table}>
                    <Text style={{ fontSize: 10, marginLeft: 50 }}>
                        {" "}
                        <Text style={{ textDecoration: "underline" }}>
                            Basic Salary:
                        </Text>
                    </Text>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>
                                {" "}
                                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                                    Base Salary:
                                </Text>
                            </Text>
                            <Text style={styles.tableCell}>
                                {" "}
                                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                                    Overtime:
                                </Text>
                            </Text>
                            {/* {boxEls} */}
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>
                                PKR {payslipContent.message.baseSalary}
                            </Text>
                            <Text style={styles.tableCell}>
                                PKR {Math.round(monthlyHoursWorked * 1000)}
                            </Text>
                        </View>
                    </View>
                    <Text style={{ fontSize: 10, marginLeft: 50 }}>
                        {" "}
                        <Text style={{ textDecoration: "underline" }}>
                            Deductions:
                        </Text>
                    </Text>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>
                                {" "}
                                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                                    Income Tax:
                                </Text>
                            </Text>
                            <Text style={styles.tableCell}>
                                {" "}
                                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                                    E.O.B.I:
                                </Text>
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>
                                PKR{" "}
                                {payslipContent.message.incomeTax *
                                    payslipContent.message.baseSalary}
                            </Text>
                            <Text style={styles.tableCell}>
                                PKR {0.01 * payslipContent.message.baseSalary}
                            </Text>
                        </View>
                    </View>
                    {/* {enrolledEls} */}
                    <Text style={{ fontSize: 10, marginLeft: 50 }}>
                        {" "}
                        <Text style={{ textDecoration: "underline" }}>
                            Net Salary:
                        </Text>
                    </Text>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>
                                {" "}
                                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                                    Net Salary:
                                </Text>
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>
                                PKR{" "}
                                {payslipContent.message.baseSalary +
                                    Math.round(monthlyHoursWorked * 1000) -
                                    payslipContent.message.baseSalary *
                                        payslipContent.message.incomeTax -
                                    0.01 * payslipContent.message.baseSalary}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.line} />
                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>
                        This is a computer generated slip and hence requires no
                        Signature.
                    </Text>
                    <Text style={styles.footerSubTitle}>
                        LAHORE UNIVERSITY OF MANAGEMENT SCIENCES, Lahore Phone
                        No: (042)35608000
                    </Text>
                    <Text>
                        URL : https://www.lums.edu.pk email:
                        employnetlums@gmail.com
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default PaySlipDoc;
