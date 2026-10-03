import sys

from PySide6.QtWidgets import (
    QApplication,
    QWidget,
    QVBoxLayout,
    QLabel,
    QPushButton,
    QListWidget,
    QFileDialog,
    QMessageBox,
)

from ocr import read_scoreboard
from calculator import calculate_scores


class AbsoluteScoreApp(QWidget):

    def __init__(self):
        super().__init__()

        self.setWindowTitle("AbsoluteScore")
        self.resize(800, 600)

        self.selected_images = []

        layout = QVBoxLayout()

        title = QLabel("ABSOLUTE SCORE")
        title.setStyleSheet("""
            font-size: 32px;
            font-weight: bold;
        """)

        subtitle = QLabel(
            "Upload scoreboard screenshots and automatically calculate scores."
        )

        self.upload_button = QPushButton(
            "📸 Upload Scoreboard Images"
        )

        self.calculate_button = QPushButton(
            "🧮 Calculate Absolute Scores"
        )

        self.image_list = QListWidget()

        self.result_list = QListWidget()

        self.status = QLabel(
            "No images selected."
        )

        self.upload_button.clicked.connect(
            self.upload_images
        )

        self.calculate_button.clicked.connect(
            self.calculate
        )

        layout.addWidget(title)
        layout.addWidget(subtitle)

        layout.addWidget(self.upload_button)

        layout.addWidget(
            QLabel("Selected Images:")
        )

        layout.addWidget(self.image_list)

        layout.addWidget(
            self.calculate_button
        )

        layout.addWidget(
            QLabel("🏆 FINAL LEADERBOARD")
        )

        layout.addWidget(
            self.result_list
        )

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

        self.selected_images = files

        self.image_list.clear()

        for file in files:
            self.image_list.addItem(file)

        self.status.setText(
            f"{len(files)} image(s) selected."
        )

    def calculate(self):

        if not self.selected_images:

            QMessageBox.warning(
                self,
                "No Images",
                "Please upload scoreboard images first."
            )

            return

        all_entries = []

        self.status.setText(
            "Reading scoreboard images..."
        )

        for image in self.selected_images:

            try:

                entries = read_scoreboard(image)

                all_entries.extend(entries)

            except Exception as error:

                print(
                    f"Error reading {image}: {error}"
                )

        if not all_entries:

            QMessageBox.warning(
                self,
                "No Scores Found",
                "The OCR could not find any team scores."
            )

            return

        results = calculate_scores(
            all_entries
        )

        self.result_list.clear()

        for position, (team, score) in enumerate(
            results,
            start=1
        ):

            self.result_list.addItem(
                f"{position}. {team} — {score}"
            )

        self.status.setText(
            f"Finished! {len(results)} teams found."
        )


if __name__ == "__main__":

    app = QApplication(sys.argv)

    window = AbsoluteScoreApp()

    window.show()

    sys.exit(app.exec())
