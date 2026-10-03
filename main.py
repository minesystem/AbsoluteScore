import sys
from PySide6.QtWidgets import (
    QApplication,
    QWidget,
    QVBoxLayout,
    QLabel,
    QPushButton,
    QListWidget,
    QFileDialog,
)


class AbsoluteScoreApp(QWidget):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("AbsoluteScore")
        self.resize(700, 500)

        layout = QVBoxLayout()

        title = QLabel("ABSOLUTE SCORE")
        title.setStyleSheet("""
            font-size: 30px;
            font-weight: bold;
        """)

        subtitle = QLabel(
            "Upload scoreboard screenshots and calculate scores automatically."
        )

        self.upload_button = QPushButton("📸 Upload Scoreboard Images")
        self.upload_button.clicked.connect(self.upload_images)

        self.image_list = QListWidget()

        self.status = QLabel("No images selected.")

        layout.addWidget(title)
        layout.addWidget(subtitle)
        layout.addWidget(self.upload_button)
        layout.addWidget(self.image_list)
        layout.addWidget(self.status)

        self.setLayout(layout)

    def upload_images(self):
        files, _ = QFileDialog.getOpenFileNames(
            self,
            "Select Scoreboard Images",
            "",
            "Images (*.png *.jpg *.jpeg *.webp)"
        )

        if not files:
            return

        self.image_list.clear()

        for file in files:
            self.image_list.addItem(file)

        self.status.setText(
            f"{len(files)} image(s) selected."
        )


if __name__ == "__main__":
    app = QApplication(sys.argv)

    window = AbsoluteScoreApp()
    window.show()

    sys.exit(app.exec())
