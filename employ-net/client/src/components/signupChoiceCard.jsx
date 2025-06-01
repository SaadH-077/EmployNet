import React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Link from "@mui/joy/Link";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { useNavigate } from "react-router-dom";
import ManageAccountsSharpIcon from "@mui/icons-material/ManageAccountsSharp";
import PeopleOutlineSharpIcon from "@mui/icons-material/PeopleOutlineSharp";

export default function SignupChoiceCard({ cardTitle }) {
    const navigate = useNavigate();

    return (
        <Card
            variant="outlined"
            orientation="horizontal"
            sx={{
                width: 280,
                "&:hover": {
                    boxShadow: "md",
                    borderColor: "neutral.outlinedHoverBorder",
                },
                margin: "1rem",
            }}
        >
            <AspectRatio ratio="1" sx={{ width: 90 }}>
                {cardTitle === "Manager" ? (
                    <ManageAccountsSharpIcon />
                ) : (
                    <PeopleOutlineSharpIcon />
                )}
            </AspectRatio>

            {/* <Avatar
                sx={{
                    m: 1,
                    bgcolor: "secondary.main",
                    // width: 56,
                    // height: 56,
                }}
            >
                {cardTitle === "Manager" ? (
                    <ManageAccountsSharpIcon />
                ) : (
                    <PeopleOutlineSharpIcon />
                )}
            </Avatar> */}

            <CardContent sx={{ alignItems: "center", margin: "auto" }}>
                <Link
                    overlay
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        cardTitle === "Manager" ? navigate("/signup/manager") : navigate("/signup/employee");
                    }}
                >
                    <Typography level="title-lg" id="card-description">
                        {cardTitle}
                    </Typography>
                </Link>
            </CardContent>
        </Card>
    );
}
