import { A, N, pipe, S } from '@mobily/ts-belt';
import { readInput } from './utils';

const hex2Bin = (hex: string): string => parseInt(hex, 16).toString(2);
const bin2Dec = (bin: string): number => parseInt(bin, 2);

const log =
  (level: number) =>
  (...strs: unknown[]) =>
    console.log(`  `.repeat(level), ...strs);

const parsePacketToBin = (packet: string) =>
  pipe(
    packet,
    S.split(''),
    A.map(hex2Bin),
    A.map((bin) => bin.padStart(4, '0')),
    A.join(''),
  );

const VERSION_LEN = 3;
const TYPE_ID_LEN = 3;
const LENGTH_TYPE_ID_LEN = 1;
const LENGTH_TYPE_0_LEN = 15;
const LENGTH_TYPE_1_LEN = 11;
const LITERAL_LEN = 5;
const LITERAL_PACKET_TYPE = 4;
const LITERAL_PACKET_END_BIT = '0';

type Packet =
  | {
      type: 'literal';
      literal: number;
      version: number;
      typeId: typeof LITERAL_PACKET_TYPE;
    }
  | {
      type: 'operator';
      children: Packet[];
      version: number;
      typeId:
        | Sum
        | Product
        | Minimum
        | Maximum
        | GreaterThan
        | LessThan
        | EqualTo;
    };

/**
 * @description their value is the sum of the values of their sub-packets.
 * If they only have a single sub-packet, their value is the value of the sub-packet.
 */
const Sum = 0;
type Sum = typeof Sum;

/**
 * @description their value is the result of multiplying together the values of their sub-packets.
 * If they only have a single sub-packet, their value is the value of the sub-packet.
 */
const Product = 1;
type Product = typeof Product;

/**
 * @description their value is the minimum of the values of their sub-packets.
 */
const Minimum = 2;
type Minimum = typeof Minimum;

/**
 * @description their value is the maximum of the values of their sub-packets.
 */
const Maximum = 3;
type Maximum = typeof Maximum;

/**
 * @description their value is 1 if the value of the first sub-packet is greater than the value of the second sub-packet;
 * otherwise, their value is 0. These packets always have exactly two sub-packets.
 */
const GreaterThan = 5;
type GreaterThan = typeof GreaterThan;

/**
 * @description their value is 1 if the value of the first sub-packet is less than the value of the second sub-packet;
 * otherwise, their value is 0. These packets always have exactly two sub-packets.
 */
const LessThan = 6;
type LessThan = typeof LessThan;

/**
 * @description their value is 1 if the value of the first sub-packet is equal to the value of the second sub-packet;
 * otherwise, their value is 0. These packets always have exactly two sub-packets.
 */
const EqualTo = 7;
type EqualTo = typeof EqualTo;

const evaluate = (packet: Packet): number => {
  if (packet.typeId === LITERAL_PACKET_TYPE) {
    return packet.literal;
  }
  switch (packet.typeId) {
    case Sum:
      return packet.children.reduce((acc, p) => acc + evaluate(p), 0);
    case Product:
      return packet.children.reduce((acc, p) => acc * evaluate(p), 1);
    case Minimum:
      return packet.children.reduce(
        (acc, p) => Math.min(acc, evaluate(p)),
        Infinity,
      );
    case Maximum:
      return packet.children.reduce(
        (acc, p) => Math.max(acc, evaluate(p)),
        -Infinity,
      );
    case GreaterThan:
      return evaluate(packet.children[0]) > evaluate(packet.children[1])
        ? 1
        : 0;
    case LessThan:
      return evaluate(packet.children[0]) < evaluate(packet.children[1])
        ? 1
        : 0;
    case EqualTo:
      return evaluate(packet.children[0]) === evaluate(packet.children[1])
        ? 1
        : 0;
  }
};

const parseBinPacket = (
  binPacket: string,
  level = 0,
): null | { packet: Packet; length: number } => {
  const ll = log(level);

  // only 0's in binary, skip
  if (bin2Dec(binPacket) === 0) {
    return null;
  }

  const version = bin2Dec(binPacket.slice(0, VERSION_LEN));
  const typeId = bin2Dec(
    binPacket.slice(VERSION_LEN, VERSION_LEN + TYPE_ID_LEN),
  ) as Packet['typeId'];

  ll(binPacket, { version, typeId });

  if (typeId === LITERAL_PACKET_TYPE) {
    // packet is a literal value

    const rest = binPacket.slice(VERSION_LEN + TYPE_ID_LEN);
    let literal = '';
    for (let i = 0; ; ++i) {
      const [continuationBit, ...dataBits] = rest.slice(
        i * LITERAL_LEN,
        i * LITERAL_LEN + LITERAL_LEN,
      );
      literal = literal.concat(dataBits.join(''));
      if (continuationBit === LITERAL_PACKET_END_BIT) {
        return {
          packet: {
            type: 'literal',
            literal: bin2Dec(literal),
            version,
            typeId,
          },
          length: VERSION_LEN + TYPE_ID_LEN + i * LITERAL_LEN + LITERAL_LEN,
        };
      }
    }
  } else {
    const lengthType = bin2Dec(
      binPacket.slice(
        VERSION_LEN + TYPE_ID_LEN,
        VERSION_LEN + TYPE_ID_LEN + LENGTH_TYPE_ID_LEN,
      ),
    );
    if (lengthType === 0) {
      // 15 bits – total length in bits of the sub-packets
      const totalLength = bin2Dec(
        binPacket.slice(
          VERSION_LEN + TYPE_ID_LEN + LENGTH_TYPE_ID_LEN,
          VERSION_LEN + TYPE_ID_LEN + LENGTH_TYPE_ID_LEN + LENGTH_TYPE_0_LEN,
        ),
      );

      const packets: Packet[] = [];
      ll({ totalLength });
      for (let len = 0; len < totalLength; ) {
        const result = parseBinPacket(
          binPacket.slice(
            VERSION_LEN +
              TYPE_ID_LEN +
              LENGTH_TYPE_ID_LEN +
              LENGTH_TYPE_0_LEN +
              len,
          ),
          level + 1,
        );
        if (!result) {
          break;
        }

        const { packet, length } = result;
        packets.push(packet);
        len += length;
      }

      return {
        packet: {
          type: 'operator',
          children: packets,
          version,
          typeId,
        },
        length:
          VERSION_LEN +
          TYPE_ID_LEN +
          LENGTH_TYPE_ID_LEN +
          LENGTH_TYPE_0_LEN +
          totalLength,
      };
    } else {
      // 11 bits – number of sub-packets
      const numberOfSubPackets = bin2Dec(
        binPacket.slice(
          VERSION_LEN + TYPE_ID_LEN + LENGTH_TYPE_ID_LEN,
          VERSION_LEN + TYPE_ID_LEN + LENGTH_TYPE_ID_LEN + LENGTH_TYPE_1_LEN,
        ),
      );

      const packets: Packet[] = [];
      let totalLength = 0;
      ll({ numberOfSubPackets });
      for (let i = 0; i < numberOfSubPackets; ++i) {
        const result = parseBinPacket(
          binPacket.slice(
            VERSION_LEN +
              TYPE_ID_LEN +
              LENGTH_TYPE_ID_LEN +
              LENGTH_TYPE_1_LEN +
              totalLength,
          ),
          level + 1,
        );
        if (!result) {
          throw new Error(`Shouldn't happen.`);
        }
        totalLength += result.length;
        packets.push(result.packet);
      }

      return {
        packet: {
          type: 'operator',
          children: packets,
          version,
          typeId,
        },
        length:
          VERSION_LEN +
          TYPE_ID_LEN +
          LENGTH_TYPE_ID_LEN +
          LENGTH_TYPE_1_LEN +
          totalLength,
      };
    }
  }
};

(async () => {
  const packet = (await readInput(16))[0];

  const binPacket = pipe(packet, parsePacketToBin);
  // console.log(binPacket);
  const result = parseBinPacket(binPacket);
  // console.log(JSON.stringify(result?.packet, null, 2));
  // console.log(sumPacketVersions(result?.packet));
  console.log(result?.packet ? evaluate(result.packet) : null);
})();

function sumPacketVersions(packet: Packet | null | undefined): number {
  if (!packet) {
    return 0;
  }
  if (packet.type === 'literal') {
    return packet.version;
  }
  return (
    packet.version +
    packet.children
      .map((el) => sumPacketVersions(el))
      .reduce((a, b) => a + b, 0)
  );
}
