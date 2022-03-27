FROM alpine as nauty
RUN apk add --no-cache build-base
RUN wget https://pallini.di.uniroma1.it/nauty27r3.tar.gz

RUN tar xvzf nauty27r3.tar.gz
WORKDIR /nauty27r3
RUN ./configure
RUN make

CMD tail -f /dev/null

FROM gapsystem/gap-docker as fullGap

COPY --from=nauty /nauty27r3/ /nauty27r3/
RUN wget https://github.com/digraphs/Digraphs/releases/download/v1.3.1/digraphs-1.3.1.tar.gz
RUN tar xvzf digraphs-1.3.1.tar.gz
RUN mv digraphs-1.3.1 /home/gap/inst/gap-4.11.1/lib/

WORKDIR /home/gap/inst/gap-4.11.1/lib/digraphs-1.3.1
RUN ./configure
RUN make

CMD tail -f /dev/null