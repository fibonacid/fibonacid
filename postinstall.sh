read -p "Do you want to open a PDF file? (y/n): " choice

if [ "$choice" = "y" ]; then
    pdf_path=./node_modules/@fibonacid/curriculum/dist/Curriculum.pdf
    open "$pdf_path"
fi
