import React from "react";

function HistorySection() {
  const historyData = [
    {
      date: "Jun 12, 2023 14:32",
      fileName: "interview_video.mp4",
      type: "Video",
      result: "Real",
      confidence: "92%",
    },
    {
      date: "Jun 11, 2023 09:15",
      fileName: "news_clip.mp3",
      type: "Audio",
      result: "Fake",
      confidence: "87%",
    },
    {
      date: "Jun 10, 2023 16:48",
      fileName: "profile_image.jpg",
      type: "Image",
      result: "Real",
      confidence: "95%",
    },
    {
      date: "Jun 9, 2023 11:27",
      fileName: "political_speech.mp4",
      type: "Video",
      result: "Fake",
      confidence: "78%",
    },
    {
      date: "Jun 8, 2023 13:52",
      fileName: "podcast_segment.wav",
      type: "Audio",
      result: "Real",
      confidence: "89%",
    },
  ];

  return (
    <div className="history-section">
      <h3 className="section-title">Recent Analysis History</h3>

      <table className="history-table">
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>File Name</th>
            <th>Type</th>
            <th>Result</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          {historyData.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.fileName}</td>
              <td>{item.type}</td>
              <td>
                <span
                  className={`status-badge ${
                    item.result.toLowerCase() === "real" ? "real" : "fake"
                  }`}
                >
                  {item.result}
                </span>
              </td>
              <td>{item.confidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistorySection;
