# syntax=docker/dockerfile:1
# Set the base image
FROM ubuntu:20.04
RUN apt-get update && apt-get install -y git python3.9 python3.9-dev
COPY . .

RUN apk add --no-cache git
RUN apk add --no-cache openssh
RUN git clone https://github.com/rachtibat/zennit-crp 
RUN pip install ./zennit-crp
