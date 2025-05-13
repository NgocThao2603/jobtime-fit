import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { CardHeader, Avatar, IconButton } from "@mui/material";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { LocationOn } from "@mui/icons-material";
import { Link } from "react-router-dom";

import { List } from "antd";

function JobCard({ listJob = [] }) {
    const datasource = listJob.map((job, index) => {
      return (
        <Card key={index} sx={{ width: "100%", height: "54vh" }}>
          <Box sx={{ position: "relative" }}>
            <CardMedia
              component="img"
              sx={{ height: 210 }}
              image={job.images_url?.[0] || "https://via.placeholder.com/400x200?text=No+Image"}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: job.job_status ? "#4caf4f" : "#f44336",
                color: "#fff",
                borderRadius: "20px",
              }}
            >
              {job.job_status ? "Đang tuyển" : "Không tuyển"}
            </Button>
          </Box>
  
          <CardContent sx={{ height: "25%" }}>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

              <Typography sx={{ fontSize: "1rem", color: "#636364" }}>
          {job.salary ? (
         <>
           <Box component="span" sx={{ color: "#c62828", fontWeight: 500 }}>
            {job.salary}
         </Box>{" "}
          triệu/tháng
    </>
  ) : (
    "Chưa có mức lương"
  )}
</Typography>
<Typography
  sx={{
    backgroundColor: "#4CAF4F", 
    color: "#fff",          
    borderRadius: "16px",     
    padding: "4px 12px",      
    display: "inline-block",    
    fontSize: "0.875rem",       
    fontWeight: 500,            
  }}
>
  Tương thích: 80%
</Typography>
              </Box>
  
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography
              gutterBottom
              variant="h5"
              component={Link}
              to="#"
              sx={{
                marginTop: "5px",
                marginBottom: "10px",
                textDecoration: "none",
                color: "inherit",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {job.title || "Không có tiêu đề"}
            </Typography>
            <Typography
                  variant="body1"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {job.location || "Không có địa chỉ"}
                </Typography>
            </Box>
            <Box sx={{ width: "100%", display: "flex" }}>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: "#636364",
                    width:"30%",
                    borderRight: "1px solid #ddd", // Gạch dọc bên phải
                    marginRight: "10px",

                  }}
                >
                  {job.type || "PartTime"}  
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: "#636364",
                    width:"30%",
                    borderRight: "1px solid #ddd", // Gạch dọc bên phải
                    marginRight: "10px",
                  }}
                >
                  {job.min_sessions_per_week || "2"} buổi/tuần
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: "#636364",
                    width:"40%",
                  }}
                >
                  {job.requires_experience ? "Yêu cầu kinh nghiệm" : "Không yêu cầu kinh nghiệm"}
                </Typography>
              </Box>
  
       </CardContent>
  
          <Divider sx={{ marginTop: "40px", marginBottom: "20px" }} />
  
          <CardHeader
            sx={{ height: "8%", marginTop: "5px" }}
            avatar={<Avatar sx={{ bgcolor: "red" }}>{job.job_agency_image}</Avatar>}
            title={job.job_agency || "Không rõ người đăng"}
          />
        </Card>
      );
    });
  
    return (
      <Stack spacing={3}>
        <List
          grid={{ gutter: 27, column: 3 }}
          pagination={{
            onChange: (page) => console.log(page),
            pageSize: 15,
            style: { display: "flex", justifyContent: "center" },
          }}
          dataSource={datasource}
          renderItem={(item) => (
            <List.Item
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              {item}
            </List.Item>
          )}
          style={{
            margin: "0 auto",
            padding: "20px 20px",
            width: "95%",
            maxWidth: "1300px",
          }}
        />
      </Stack>
    );
  }
  
export default JobCard;
