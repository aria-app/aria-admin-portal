import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import type { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'http://localhost:5000',
});

export interface AboutProps {
  voices: any[];
}

export const About: NextPage<AboutProps> = (props) => {
  const { voices = [] } = props;
  useEffect(() => {
    console.log('voices', voices);
  }, [voices]);

  return (
    <div>
      <ul>
        {voices.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<AboutProps> = async () => {
  try {
    const { data } = await client.query({
      query: gql`
        query GetVoices {
          voices {
            data {
              id
              name
              toneOscillatorType
            }
          }
        }
      `,
    });
    const { voices } = data;

    console.log({ voices });

    return {
      props: {
        voices: voices?.data || [],
      },
    };
  } catch (error) {
    console.log({ error });
    return {
      props: { voices: [] },
    };
  }
};

export default About;
