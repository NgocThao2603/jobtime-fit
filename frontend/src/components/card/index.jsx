import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {
  CardHeader,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { LocationOn } from "@mui/icons-material";
import { Close } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { calendarApi } from "../../services/api"
import { calculateFitPercentage } from "../../utils/calculateFitPercentage";
import { List } from "antd";
import FitCalendar from "../FitCalendar";

function JobCard({ listJob = [] }) {
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [userTimes, setUserTimes] = useState([]);

  useEffect(() => {
    calendarApi.getCalendar()
      .then(res => setUserTimes(res.data))
      .catch(err => console.error("Lỗi lấy userTimes:", err));
  }, []);

  const handleOpenDialog = (job) => {
    setSelectedJob(job);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedJob(null);
  };
  // Hàm lấy % tương thích cho từng job
  const getFitPercent = (job) => {
    if (!job || !userTimes.length) return 0;
    return calculateFitPercentage(job.jobTimes, userTimes);
  };

  const datasource = listJob.map((job, index) => {
    // console.log("jobCard: ", job.min_sessions_per_week);
    return (
      <Card key={index} sx={{ width: "100%", height: "100%", boxShadow: 3, borderRadius: 3, marginBottom: 2 }}>
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            sx={{ height: 250 }}
            image={
              job.image_url ||
              "https://via.placeholder.com/400x200?text=No+Image"
            }
          />
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: job.job_status ? "#4caf4f" : "#000",
              color: "#fff",
              borderRadius: "20px",
              padding: "6px 16px",
              fontSize: "0.875rem",
              fontWeight: 500,
              textAlign: "center",
              cursor: "default", // giữ mặc định như text, có thể là 'pointer' nếu cần click
            }}
          >
            {job.job_status ? "Đang tuyển" : "Không tuyển"}
          </Box>
        </Box>

        <CardContent sx={{ height: "50%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontSize: "1.2rem", color: "#636364" }}>
              {job.salary ? (
                <>
                  <Box
                    component="span"
                    sx={{ color: "#c62828", fontWeight: 500 }}
                  >
                    {job.salary}
                  </Box>{" "}
                </>
              ) : (
                "Chưa có mức lương"
              )}
            </Typography>
          <Button
            sx={{
              backgroundColor: () => {
                const percent = getFitPercent(job);
                if (percent >= 70) return "#4CAF4F";  // xanh
                else if (percent >= 50) return "#FFC107"; // vàng
                else return "#F44336";  // đỏ
              },
              color: () => {
                const percent = getFitPercent(job);
                if (percent >= 50 && percent < 70) return "#000";
                else return "#fff"; 
              },
              borderRadius: "16px",
              padding: "4px 12px",
              display: "inline-block",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
            onClick={() => handleOpenDialog(job)}
          >
            Tương thích: <span className="font-bold text-xl">{getFitPercent(job)}%</span>
          </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start", // Đảm bảo căn theo đỉnh cho đúng dòng
              marginTop: "10px",
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component={Link}
              to="#"
              sx={{
                marginBottom: "10px",
                textDecoration: "none",
                color: "inherit",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "60%",
                minHeight: "64px", // Đảm bảo chiều cao tối thiểu
                color: "#00528D",
                fontWeight: 600,
                "&:hover": {
                  color: "#00528D", // Không đổi màu khi hover
                  textDecoration: "none", // Ngăn gạch chân khi hover
                },
              }}
            >
              {job.title || "Không có tiêu đề"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "35%", // Đảm bảo không đè lên tiêu đề
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
                width: "30%",
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
                width: "30%",
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
                width: "40%",
              }}
            >
              {job.requires_experience
                ? "Yêu cầu kinh nghiệm"
                : "Không yêu cầu kinh nghiệm"}
            </Typography>
          </Box>
        </CardContent>

        <Divider />

        <CardHeader
          sx={{ height: "5%", marginTop: "5px", marginBottom: "5px" }}
          avatar={
            <Avatar
              src={job.job_agency_image} // Nếu là URL ảnh
            >
              {/* Nếu src không có, fallback text có thể là chữ đầu của tên */}
              {job.job_agency ? job.job_agency.charAt(0) : "?"}
            </Avatar>
          }
          title={job.job_agency || "Không rõ người đăng"}
        />
      </Card>
    );
  });

  return (
    <>
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
            // maxHeight: "60vh",
          }}
        />
      </Stack>

      {/* Dialog hiện chi tiết tương thích */}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        maxWidth={false}
        fullWidth
        sx={{ width: "90%", left: "5%", right: "5%" }}
      >
        <DialogTitle
          sx={{ textAlign: "center", color: "green", fontSize: "1.25rem", fontWeight: 900 }}
        >
          Chi tiết mức độ tương thích
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedJob ? (
            <FitCalendar
              jobTimes={selectedJob.jobTimes}
              minSessionsPerWeek={selectedJob.min_sessions_per_week}
            />
          ) : (
            <Typography variant="body1">Đang tải dữ liệu...</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default JobCard;
