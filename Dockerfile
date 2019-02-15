FROM kdelfour/cloud9-docker
RUN apt-get update \
    && apt-get install -y software-properties-common \
    && add-apt-repository ppa:inkscape.dev/stable \
    && apt-get update \
    && apt-get install -y  pdftk inkscape pdf2svg ghostscript language-pack-ja fonts-takao \
    && rm -rf /var/lib/apt/lists/*
RUN npm install -g n \
    && n 6 \
    && npm install -g npm@4.2.0 \
    && npm install -g svgo-compress-image
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]