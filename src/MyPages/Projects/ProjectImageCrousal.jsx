import React from "react";
import { CCarousel, CCarouselItem, CImage, CModal, CModalHeader, CModalTitle, CModalBody } from "@coreui/react";
import { FaPaperclip } from "react-icons/fa"; 

const AttachmentsCarousel = ({ visible, setVisible, attachments, apiUrl }) => {
  if (!attachments || attachments.length === 0) return null;

  return (
    <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
      <CModalHeader>
        <CModalTitle>Attachments</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CCarousel controls indicators>
          {attachments.map((file, index) => {
            const fileUrl = `${apiUrl}/uploads/tasks/${file}`;
            const fileName = file.split("/").pop().toLowerCase();

            const isImage = /\.(png|jpg|jpeg|gif|webp|bmp)$/i.test(fileName);
            const isVideo = /\.(mp4|webm|ogg)$/i.test(fileName);
            const isPDF = /\.pdf$/i.test(fileName);

            return (
              <CCarouselItem key={index}>
                {isImage ? (
                  <CImage className="d-block w-100" src={fileUrl} alt={fileName} />
                ) : (
                 <div
  className="d-flex flex-column justify-content-center align-items-center border rounded bg-light"
  style={{ width: "100%", height: "500px", cursor: "pointer" }}
  onClick={() => window.open(fileUrl, "_blank")}
  title={fileName}
>
  {isVideo ? (
    <img
      src="https://cdn-icons-png.flaticon.com/512/136/136530.png"
      alt="Video"
      style={{ width: "80px", height: "80px" }}
    />
  ) : isPDF ? (
    <img
      src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
      alt="PDF"
      style={{ width: "180px", height: "180px" }}
    />
  ) : (
    <FaPaperclip className="text-secondary" style={{ fontSize: "80px" }} />
  )}

  {/* Text below icon */}
  {!isVideo && (
    <span className="mt-2 text-muted" style={{ fontSize: "16px" }}>
      Open file
    </span>
  )}
</div>

                )}
              </CCarouselItem>
            );
          })}
        </CCarousel>
      </CModalBody>
    </CModal>
  );
};

export default AttachmentsCarousel;
